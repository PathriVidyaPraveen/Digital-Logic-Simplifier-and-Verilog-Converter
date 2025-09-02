document.addEventListener('DOMContentLoaded', () => {
    const varCountSelect = document.getElementById('varCount');
    const truthTableBody = document.querySelector('#truthTable tbody');
    const truthTableHeader = document.querySelector('#truthTable thead');
    const processBtn = document.getElementById('processBtn');
    const kMapTable = document.getElementById('kMapTable');
    const rawExpressionEl = document.getElementById('rawExpression');
    const mathJaxExpressionEl = document.getElementById('mathJaxExpression');
    const verilogCodeEl = document.getElementById('verilogCode');
    const testbenchCodeEl = document.getElementById('testbenchCode');
    const copyVerilogBtn = document.getElementById('copyVerilogBtn');
    const downloadVerilogBtn = document.getElementById('downloadVerilogBtn');
    const copyTestbenchBtn = document.getElementById('copyTestbenchBtn');
    const downloadTestbenchBtn = document.getElementById('downloadTestbenchBtn');

    const variables = ['A', 'B', 'C', 'D', 'E'];
    
    function generateTruthTable() {
        const varCount = parseInt(varCountSelect.value);
        const numRows = Math.pow(2, varCount);
        const inputVars = variables.slice(0, varCount);

        truthTableHeader.innerHTML = `
            <tr>
                ${inputVars.map(v => `<th>${v}</th>`).join('')}
                <th>F</th>
            </tr>
        `;

        let tableHTML = '';
        for (let i = 0; i < numRows; i++) {
            const binary = i.toString(2).padStart(varCount, '0');
            tableHTML += `
                <tr>
                    ${binary.split('').map(bit => `<td>${bit}</td>`).join('')}
                    <td>
                        <select class="form-select-sm output-select">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="X">X</option>
                        </select>
                    </td>
                </tr>
            `;
        }
        truthTableBody.innerHTML = tableHTML;
    }

    function generateKMap(minterms, dontCares) {
        const varCount = parseInt(varCountSelect.value);
        let kMapHTML = '';
        kMapTable.innerHTML = '';

        const grayCode = (n) => {
            const result = [];
            for (let i = 0; i < (1 << n); i++) {
                result.push((i ^ (i >> 1)).toString(2).padStart(n, '0'));
            }
            return result;
        };

        if (varCount === 2) {
            kMapHTML = `
                <thead>
                    <tr>
                        <th rowspan="2" colspan="2"></th>
                        <th colspan="2">${variables[1]}</th>
                    </tr>
                    <tr>
                        <th>0</th>
                        <th>1</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th rowspan="2">${variables[0]}</th>
                        <th>0</th>
                        <td data-index="0"></td>
                        <td data-index="1"></td>
                    </tr>
                    <tr>
                        <th>1</th>
                        <td data-index="2"></td>
                        <td data-index="3"></td>
                    </tr>
                </tbody>
            `;
        } else if (varCount === 3) {
            const colHeaders = ['00', '01', '11', '10'];
            const indices = [0, 1, 3, 2, 4, 5, 7, 6];
            kMapHTML = `
                <thead>
                    <tr>
                        <th colspan="2" rowspan="2"></th>
                        <th colspan="4">${variables[1]}${variables[2]}</th>
                    </tr>
                    <tr>
                        ${colHeaders.map(h => `<th>${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th rowspan="2">${variables[0]}</th>
                        <th>0</th>
                        ${indices.slice(0, 4).map(i => `<td data-index="${i}"></td>`).join('')}
                    </tr>
                    <tr>
                        <th>1</th>
                        ${indices.slice(4, 8).map(i => `<td data-index="${i}"></td>`).join('')}
                    </tr>
                </tbody>
            `;
        } else if (varCount === 4) {
            const colHeaders = ['00', '01', '11', '10'];
            const rowHeaders = ['00', '01', '11', '10'];
            const indices = [0, 1, 3, 2, 4, 5, 7, 6, 12, 13, 15, 14, 8, 9, 11, 10];
            kMapHTML = `
                <thead>
                    <tr>
                        <th colspan="2" rowspan="2"></th>
                        <th colspan="4">${variables[2]}${variables[3]}</th>
                    </tr>
                    <tr>
                        ${colHeaders.map(h => `<th>${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${rowHeaders.map((row, rIdx) => `
                        <tr>
                            ${rIdx === 0 ? `<th rowspan="4">${variables[0]}${variables[1]}</th>` : ''}
                            <th>${row}</th>
                            ${indices.slice(rIdx * 4, (rIdx + 1) * 4).map(i => `<td data-index="${i}"></td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            `;
        } else if (varCount === 5) {
            const colHeaders = ['00', '01', '11', '10'];
            const rowHeaders = ['00', '01', '11', '10'];
            const indices = [
                0, 1, 3, 2, 4, 5, 7, 6, 12, 13, 15, 14, 8, 9, 11, 10,
                16, 17, 19, 18, 20, 21, 23, 22, 28, 29, 31, 30, 24, 25, 27, 26
            ];
            kMapHTML = `
                <h5 class="text-center">${variables[4]} = 0</h5>
                <table class="table table-bordered text-center">
                    <thead>
                        <tr>
                            <th colspan="2" rowspan="2"></th>
                            <th colspan="4">${variables[2]}${variables[3]}</th>
                        </tr>
                        <tr>
                            ${colHeaders.map(h => `<th>${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rowHeaders.map((row, rIdx) => `
                            <tr>
                                ${rIdx === 0 ? `<th rowspan="4">${variables[0]}${variables[1]}</th>` : ''}
                                <th>${row}</th>
                                ${indices.slice(rIdx * 4, (rIdx + 1) * 4).map(i => `<td data-index="${i}"></td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <h5 class="text-center">${variables[4]} = 1</h5>
                <table class="table table-bordered text-center">
                    <thead>
                        <tr>
                            <th colspan="2" rowspan="2"></th>
                            <th colspan="4">${variables[2]}${variables[3]}</th>
                        </tr>
                        <tr>
                            ${colHeaders.map(h => `<th>${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rowHeaders.map((row, rIdx) => `
                            <tr>
                                ${rIdx === 0 ? `<th rowspan="4">${variables[0]}${variables[1]}</th>` : ''}
                                <th>${row}</th>
                                ${indices.slice((rIdx + 4) * 4, (rIdx + 5) * 4).map(i => `<td data-index="${i}"></td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
        
        kMapTable.innerHTML = kMapHTML;
        kMapTable.querySelectorAll('td').forEach(td => {
            const index = parseInt(td.dataset.index);
            if (minterms.includes(index)) {
                td.textContent = '1';
                td.style.backgroundColor = '#d1e7dd';
            } else if (dontCares.includes(index)) {
                td.textContent = 'X';
                td.style.backgroundColor = '#fef3c7';
            } else {
                td.textContent = '0';
            }
        });
    }

    function simplify(minterms, dontCares, varCount) {
        if (minterms.length === 0) return [];
        if (minterms.length + dontCares.length === Math.pow(2, varCount)) {
             return [{ binary: '-'.repeat(varCount), minterms: [...minterms, ...dontCares] }];
        }

        const toBinary = (n) => n.toString(2).padStart(varCount, '0');
        const countOnes = (s) => (s.match(/1/g) || []).length;

        let groups = new Map();
        [...minterms, ...dontCares].forEach(m => {
            const binary = toBinary(m);
            const ones = countOnes(binary);
            if (!groups.has(ones)) groups.set(ones, []);
            groups.get(ones).push({
                minterms: [m],
                binary: binary,
                used: false
            });
        });

        let primeImplicants = [];
        let newGroups = new Map();
        let changed = true;

        while (changed) {
            changed = false;
            newGroups = new Map();
            const keys = Array.from(groups.keys()).sort((a, b) => a - b);

            for (let i = 0; i < keys.length - 1; i++) {
                const groupA = groups.get(keys[i]);
                const groupB = groups.get(keys[i + 1]);

                groupA.forEach(termA => {
                    groupB.forEach(termB => {
                        let diff = 0;
                        let diffIndex = -1;
                        for (let k = 0; k < varCount; k++) {
                            if (termA.binary[k] !== termB.binary[k]) {
                                diff++;
                                diffIndex = k;
                            }
                        }

                        if (diff === 1) {
                            changed = true;
                            termA.used = true;
                            termB.used = true;
                            const newBinary = termA.binary.substring(0, diffIndex) + '-' + termA.binary.substring(diffIndex + 1);
                            const newMinterms = [...termA.minterms, ...termB.minterms];
                            const newOnes = countOnes(newBinary);

                            if (!newGroups.has(newOnes)) newGroups.set(newOnes, []);
                            const exists = newGroups.get(newOnes).some(t => t.binary === newBinary);
                            if (!exists) {
                                newGroups.get(newOnes).push({
                                    minterms: [...new Set(newMinterms)],
                                    binary: newBinary,
                                    used: false
                                });
                            }
                        }
                    });
                });
            }

            groups.forEach(group => {
                group.forEach(term => {
                    if (!term.used) {
                        primeImplicants.push(term);
                    }
                });
            });
            groups = newGroups;
        }

        groups.forEach(group => {
            primeImplicants.push(...group);
        });

        // Unique prime implicants
        const uniquePrimes = [];
        const seen = new Set();
        primeImplicants.forEach(pi => {
            if (!seen.has(pi.binary)) {
                uniquePrimes.push(pi);
                seen.add(pi.binary);
            }
        });
        primeImplicants = uniquePrimes;

        // Simplified Petrick's Method to select essential primes
        const mintermSet = new Set(minterms);
        const essentialPrimes = new Set();
        let coveredMinterms = new Set();

        mintermSet.forEach(m => {
            const coveringPrimes = primeImplicants.filter(pi => pi.minterms.includes(m));
            if (coveringPrimes.length === 1) {
                const prime = coveringPrimes[0];
                essentialPrimes.add(prime);
                prime.minterms.forEach(coveredMinterms.add, coveredMinterms);
            }
        });

        let uncoveredMinterms = [...mintermSet].filter(m => !coveredMinterms.has(m));
        
        if (uncoveredMinterms.length > 0) {
            let remainingPrimes = primeImplicants.filter(pi => !essentialPrimes.has(pi));
            while (uncoveredMinterms.length > 0 && remainingPrimes.length > 0) {
                let bestPrime = null;
                let maxCover = -1;

                remainingPrimes.forEach(pi => {
                    const currentCover = pi.minterms.filter(m => uncoveredMinterms.includes(m)).length;
                    if (currentCover > maxCover) {
                        maxCover = currentCover;
                        bestPrime = pi;
                    }
                });

                if (bestPrime) {
                    essentialPrimes.add(bestPrime);
                    bestPrime.minterms.forEach(m => {
                        const index = uncoveredMinterms.indexOf(m);
                        if (index !== -1) {
                            uncoveredMinterms.splice(index, 1);
                        }
                    });
                    remainingPrimes = remainingPrimes.filter(pi => pi !== bestPrime);
                } else {
                    break;
                }
            }
        }
        
        return Array.from(essentialPrimes);
    }
    
    function formatExpression(implicants, varCount) {
        if (implicants.length === 0) {
            return { plain: "1'b0", verilog: "1'b0", math: '0' };
        }
        
        if (implicants.length === 1 && implicants[0].binary.split('').every(c => c === '-')) {
             return { plain: "1'b1", verilog: "1'b1", math: '1' };
        }

        const terms = implicants.map(implicant => {
            let plainTerm = '';
            let verilogTerm = '';
            let mathTerm = '';
            
            for (let i = 0; i < varCount; i++) {
                const char = implicant.binary[i];
                if (char === '1') {
                    plainTerm += variables[i];
                    verilogTerm += variables[i];
                    mathTerm += variables[i];
                } else if (char === '0') {
                    plainTerm += `~${variables[i]}`;
                    verilogTerm += `~${variables[i]}`;
                    mathTerm += `\\overline{${variables[i]}}`;
                }
            }
            
            return { plain: plainTerm, verilog: verilogTerm, math: mathTerm };
        });

        const plainExpression = terms.map(t => t.plain).join(' | ').replace(/(\w)(\w)/g, '$1 & $2').replace(/& \|/g, '|');
        const verilogExpression = terms.map(t => t.verilog).join(' || ').replace(/(\w)(\w)/g, '$1 && $2').replace(/&& \|\|/g, '||');
        const mathJaxExpression = terms.map(t => t.math).join(' + ');
        
        return {
            plain: plainExpression,
            verilog: verilogExpression,
            math: mathJaxExpression
        };
    }

    function generateVerilog(vars, expression) {
        const inputs = vars.map(v => `input ${v}`).join(", ");
        return `module circuit(${inputs}, output F);
  assign F = ${expression};
endmodule`;
    }

    function generateTestbench(vars) {
        const n = vars.length;
        const varList = vars.join(", ");
        const binaryFormat = `%${n}b`;

        return `\`timescale 1ns / 1ps

module tb;
  reg ${varList};
  wire F;

  circuit uut(${varList}, F);

  initial begin
    $dumpfile("tb.vcd");
    $dumpvars(0, tb);
    
    $display("--------------------------------");
    $display("Testing circuit with ${n} variables");
    $display("--------------------------------");
    $display("${vars.join(" ")} | F");
    
    for (integer i = 0; i < ${Math.pow(2, n)}; i = i + 1) begin
      {${varList}} = i;
      #10;
      $display("${binaryFormat} | %b", {${varList}}, F);
    end
    
    $display("--------------------------------");
    $display("Test complete.");
    $finish;
  end
endmodule`;
    }

    // Event Listeners
    varCountSelect.addEventListener('change', generateTruthTable);
    processBtn.addEventListener('click', () => {
        const varCount = parseInt(varCountSelect.value);
        const outputs = [...document.querySelectorAll('.output-select')].map(s => s.value);
        const minterms = outputs.map((val, i) => val === '1' ? i : -1).filter(i => i !== -1);
        const dontCares = outputs.map((val, i) => val === 'X' ? i : -1).filter(i => i !== -1);
        const vars = variables.slice(0, varCount);
        
        // Handle all '0's and all '1's cases upfront
        const allZeros = outputs.every(val => val === '0' || val === 'X');
        const allOnes = outputs.every(val => val === '1' || val === 'X');

        let expression;
        if (allOnes) {
            expression = { plain: "1", verilog: "1'b1", math: '1' };
        } else if (allZeros) {
            expression = { plain: "0", verilog: "1'b0", math: '0' };
        } else {
            const simplifiedImplicants = simplify(minterms, dontCares, varCount);
            expression = formatExpression(simplifiedImplicants, varCount);
        }

        rawExpressionEl.textContent = expression.plain;
        mathJaxExpressionEl.textContent = `$${expression.math}$`;
        MathJax.typesetPromise([mathJaxExpressionEl]);
        verilogCodeEl.textContent = generateVerilog(vars, expression.verilog);
        testbenchCodeEl.textContent = generateTestbench(vars);

        generateKMap(minterms, dontCares);
    });

    copyVerilogBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(verilogCodeEl.textContent);
        alert('Verilog code copied to clipboard!');
    });

    downloadVerilogBtn.addEventListener('click', () => {
        const filename = 'circuit.v';
        const blob = new Blob([verilogCodeEl.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    });

    copyTestbenchBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(testbenchCodeEl.textContent);
        alert('Testbench code copied to clipboard!');
    });

    downloadTestbenchBtn.addEventListener('click', () => {
        const filename = 'tb_circuit.v';
        const blob = new Blob([testbenchCodeEl.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    });

    generateTruthTable();
});