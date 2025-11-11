// staticAnalysis.js
const fs = require('fs');
const path = require('path');

// Read and compile .gitignore patterns
const gitignorePath = path.join(process.cwd(), '.gitignore');
let ignorePatterns = [];
if (fs.existsSync(gitignorePath)) {
    ignorePatterns = fs.readFileSync(gitignorePath, 'utf8')
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
}

// Check if a path should be ignored
function isIgnored(filePath) {
    return ignorePatterns.some(pattern => {
        return filePath.includes(pattern);
    });
}

// Recursively collect .js files, excluding ignored paths
function getJsFiles(dir) {
    let files = [];
    for (const entry of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, entry);
        if (isIgnored(fullPath)) continue;
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            files = files.concat(getJsFiles(fullPath));
        } else if (stat.isFile() && fullPath.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    return files;
}

// Determine if path is front-end or back-end
function classifyFile(filePath) {
    const lower = filePath.toLowerCase();
    if (lower.includes('frontend') || lower.includes('client')) return 'frontend';
    if (lower.includes('backend') || lower.includes('server')) return 'backend';
    return null;
}

// Remove JS comments from code
function stripComments(code) {
    return code
        .replace(/\/\/.*$/mg, '')
        .replace(/\/\*[\s\S]*?\*\//mg, '');
}

// Tokenize code into operators/operands
function tokenize(code) {
    const operatorPattern = /\b(if|else|for|while|do|switch|case|default|break|continue|return|throw|try|catch|finally|new|delete|typeof|instanceof|in|of|await|async|class|extends|super|import|export|from|as|let|const|var|function|=>)\b|===|!==|==|!=|<=|>=|\+\+|--|\+=|-=|\*=|\/=|%=|&&|\|\||\?|:|=>|<<|>>|>>>|[+\-*/%&|^~=<>!,.(){}[\]]/g;
    const operandPattern = /([A-Za-z_$][A-Za-z0-9_$]*)|(\d+(\.\d+)?)|(".*?"|'.*?'|`.*?`)/g;
    let operators = [], operands = [];
    let match;
    
    while ((match = operatorPattern.exec(code)) !== null) {
        operators.push(match[0]);
    }
    
    while ((match = operandPattern.exec(code)) !== null) {
        const token = match[0];
        if (/^\d/.test(token) || /^["'`]/.test(token)) {
            operands.push(token);
        } else {
            operands.push(token);
        }
    }
    return {operators, operands};
}

// Analyze a list of files for Halstead metrics and live variables
function analyzeFiles(files) {
    const halstead = { n1: 0, n2: 0, N1: 0, N2: 0 };
    const operatorSet = new Set();
    const operandSet = new Set();
    const importsMap = {};
    let totalDeclaredVars = 0;
    let totalVarReferences = 0;

    files.forEach(filePath => {
        const code = fs.readFileSync(filePath, 'utf8');
        const cleanCode = stripComments(code);
        const {operators, operands} = tokenize(cleanCode);
        
        operators.forEach(op => operatorSet.add(op));
        operands.forEach(op => operandSet.add(op));
        halstead.N1 += operators.length;
        halstead.N2 += operands.length;

        const dir = path.dirname(filePath);
        importsMap[filePath] = [];
        const importRegex = /(?:require\(['"`](.+?)['"`]\))|(?:import\s+.*?from\s+['"`](.+?)['"`])/g;
        let m;
        while ((m = importRegex.exec(cleanCode)) !== null) {
            const modPath = m[1] || m[2];
            if (!modPath) continue;
            if (modPath.startsWith('.')) {
                const resolved = path.resolve(dir, modPath);
                const fullPath = fs.existsSync(resolved + '.js') ? resolved + '.js'
                                  : fs.existsSync(resolved) ? resolved : null;
                if (fullPath && files.includes(fullPath)) {
                    importsMap[filePath].push(fullPath);
                }
            }
        }

        const varDeclPattern = /\b(var|let|const)\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;
        const funcDeclPattern = /\bfunction\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;
        let declared = new Set();
        let vm;
        while ((vm = varDeclPattern.exec(cleanCode)) !== null) {
            declared.add(vm[2]);
        }
        while ((vm = funcDeclPattern.exec(cleanCode)) !== null) {
            declared.add(vm[1]);
        }
        totalDeclaredVars += declared.size;
        declared.forEach(v => {
            const pattern = new RegExp(`\\b${v}\\b`, 'g');
            const count = (cleanCode.match(pattern) || []).length;
            totalVarReferences += Math.max(0, count - 1);
        });
    });

    halstead.n1 = operatorSet.size;
    halstead.n2 = operandSet.size;
    const n = halstead.n1 + halstead.n2;
    const N = halstead.N1 + halstead.N2;

    const vocabulary = n;
    const programLength = N;
    const volume = N * (n > 0 ? Math.log2(n) : 0);
    const difficulty = halstead.n2 > 0 ? (halstead.n1 / 2) * (halstead.N2 / halstead.n2) : 0;
    const effort = volume * difficulty;

    let totalFanIn = 0, totalFanOut = 0;
    const fanInMap = {};
    Object.keys(importsMap).forEach(file => fanInMap[file] = 0);
    Object.entries(importsMap).forEach(([file, importedFiles]) => {
        const uniqueImports = Array.from(new Set(importedFiles));
        totalFanOut += uniqueImports.length;
        uniqueImports.forEach(dep => {
            if (fanInMap[dep] !== undefined) {
                fanInMap[dep]++;
            }
        });
    });
    Object.values(fanInMap).forEach(fi => { totalFanIn += fi; });
    const numModules = Object.keys(importsMap).length;
    const avgFanIn = numModules > 0 ? (totalFanIn / numModules) : 0;
    const avgFanOut = numModules > 0 ? (totalFanOut / numModules) : 0;
    let sumIF = 0;
    Object.entries(importsMap).forEach(([file, importedFiles]) => {
        const fi = fanInMap[file] || 0;
        const fo = Array.from(new Set(importedFiles)).length;
        sumIF += (fi * fo) ** 2;
    });
    const avgInformationFlow = numModules > 0 ? sumIF / numModules : 0;

    const totalLiveVariables = totalVarReferences;
    const avgLiveVars = totalDeclaredVars > 0 ? totalVarReferences / totalDeclaredVars : 0;

    return {
        halstead: { n1: halstead.n1, n2: halstead.n2, N1: halstead.N1, N2: halstead.N2,
                     vocabulary, programLength, volume, difficulty, effort },
        infoFlow: { totalFanIn, totalFanOut, avgFanIn, avgFanOut, avgInformationFlow },
        liveVars: { totalDeclaredVars, totalLiveVariables, avgLiveVars }
    };
}

// Main analysis
const allFiles = getJsFiles(process.cwd());
const groups = { frontend: [], backend: [] };
allFiles.forEach(f => {
    const cls = classifyFile(f);
    if (cls) groups[cls].push(f);
});

['frontend', 'backend'].forEach(side => {
    const files = groups[side];
    if (files.length === 0) {
        console.log(`No ${side} files detected.`);
        return;
    }
    const result = analyzeFiles(files);

    console.log(`\n==== ${side.charAt(0).toUpperCase() + side.slice(1)} Code Metrics ====\n`);
    console.log('Halstead Complexity:');
    console.log(`  n1 (distinct operators): ${result.halstead.n1}`);
    console.log(`  n2 (distinct operands): ${result.halstead.n2}`);
    console.log(`  N1 (total operators): ${result.halstead.N1}`);
    console.log(`  N2 (total operands): ${result.halstead.N2}`);
    console.log(`  Vocabulary (n): ${result.halstead.vocabulary}`);
    console.log(`  Program Length (N): ${result.halstead.programLength}`);
    console.log(`  Volume (V): ${result.halstead.volume.toFixed(2)}`);
    console.log(`  Difficulty (D): ${result.halstead.difficulty.toFixed(2)}`);
    console.log(`  Effort (E): ${result.halstead.effort.toFixed(2)}`);
    console.log(`  Basic Information (Volume): ${result.halstead.volume.toFixed(2)}\n`);

    console.log('Information Flow Metrics:');
    console.log(`  Total Fan-in: ${result.infoFlow.totalFanIn}`);
    console.log(`  Total Fan-out: ${result.infoFlow.totalFanOut}`);
    console.log(`  Avg Fan-in per module: ${result.infoFlow.avgFanIn.toFixed(2)}`);
    console.log(`  Avg Fan-out per module: ${result.infoFlow.avgFanOut.toFixed(2)}`);
    console.log(`  Avg Information Flow ((Fi*Fo)^2): ${result.infoFlow.avgInformationFlow.toFixed(2)}\n`);

    console.log('Live Variable Metrics:');
    console.log(`  Total Unique Variables Declared: ${result.liveVars.totalDeclaredVars}`);
    console.log(`  Total Live Variable References: ${result.liveVars.totalLiveVariables}`);
    console.log(`  Avg Live Vars References per Var: ${result.liveVars.avgLiveVars.toFixed(2)}`);
    console.log('---------------------------------------');
});