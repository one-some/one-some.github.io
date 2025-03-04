let input = `
(print (cat "hullo there " "meow"))

`.trim();

function assert(maybeTrue, errorMsg) {
    if (!maybeTrue) throw new Error(errorMsg);
}

class Node {
    content = "";
    eval() {
        return this;
    }
}

class StringNode extends Node {}
class SymbolNode extends Node {}

let i = 0;
function eatParens() {
    let out = [""]

    while (input[++i] !== ")" && i < input.length) {
        if (input[i] === "(") {
            out.push(eatParens());
            out.push("");
        }

        if (!input[i]) break;
        out[out.length - 1] += input[i];
    }


    if (input[i] === ")") {
        i++;
    }

    return out.filter(x => typeof x !== "string" || x.trim());
}

let chunks = eatParens(input);

function splitChunk(chunk) {
    let out = [new SymbolNode()];

    let bit;
    while (bit = chunk.shift()) {
        if (Array.isArray(bit)) {
            out.push(splitChunk(bit));
            continue;
        }

        for (let i = 0; i < bit.length; i++) {
            const char = bit[i];

            if (char === '"') {
                let stringNode = new StringNode();
                out.push(stringNode);
                while (bit[++i] !== '"') {
                    stringNode.content += bit[i];
                }
                out.push(new SymbolNode());
                continue;
            }

            if (char === " ") {
                out.push(new SymbolNode());
                continue;
            }
            out[out.length - 1].content += char;
        }
    }

    return out.filter(x => Array.isArray(x) || x.content.trim());
}

function treeString(chunks, indent=0) {
    let out = "";
    for (const chunk of chunks) {
        let rep = "";
        if (Array.isArray(chunk)) {
            rep = treeString(chunk, indent + 1);
        } else {
            rep = `${chunk.constructor.name} '${chunk.content}'`;
        }

        for (let i = 0; i < indent; i++) {
            out += "    ";
        }

        out += `${rep}\n`
    }

    return out;
}

chunks = splitChunk(chunks);
console.log(input);
console.log(treeString(chunks));

function eval(tree) {
    if (!Array.isArray(tree)) return tree;

    const head = tree.shift().eval().content;

    // TODO: NOT ALWAYS IE IF
    const args = tree.map(eval);

    switch (head) {
        case "print":
            console.log(args[0]);
            return null;
        case "cat":
            return args.map(x => x.content).join("");
        default:
            throw new Error(`Bad ${head}`);
    }
    console.log(tree);
}

eval(chunks);
