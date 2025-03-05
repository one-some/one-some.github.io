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

class Code {
    input = "";
    i = 0;

    constructor(input) {
        this.input = input;
    }

    eatParens() {
        let out = [""]

        while (this.input[++this.i] !== ")" && this.i < this.input.length) {
            if (this.input[this.i] === "(") {
                out.push(this.eatParens());
                out.push("");
            }

            if (!this.input[this.i]) break;
            out[out.length - 1] += this.input[this.i];
        }


        if (this.input[this.i] === ")") {
            this.i++;
        }

        return out.filter(x => typeof x !== "string" || x.trim());
    }

}


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

function eval(tree) {
    if (!Array.isArray(tree)) return tree;

    const head = tree.shift().eval().content;

    // TODO: NOT ALWAYS IE IF
    const args = tree.map(eval);

    switch (head) {
        case "print":
            output(args[0]);
            return null;
        case "cat":
            return args.map(x => x.content).join("");
        default:
            throw new Error(`Bad ${head}`);
    }
}

function output(text) {
    const el = document.createElement("span");
    el.innerText = text;
    document.getElementById("console").appendChild(el);
}

function run(text) {
    const code = new Code(text);
    let chunks = code.eatParens();
    chunks = splitChunk(chunks);
    console.log(treeString(chunks));
    eval(chunks);
}

const textarea = document.querySelector("textarea");
run(textarea.value);

document.getElementById("execute").addEventListener("click", function() {
    run(textarea.value);
});
