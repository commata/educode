export type EditorLanguage = 'python' | 'java' | 'javascript' | 'cpp';

export const LANGUAGE_OPTIONS: Array<{ label: string; value: EditorLanguage; judge0Key: string }> = [
  { label: 'Python 3', value: 'python', judge0Key: 'python' },
  { label: 'Java 17', value: 'java', judge0Key: 'java' },
  { label: 'JavaScript (Node.js)', value: 'javascript', judge0Key: 'javascript' },
  { label: 'C++17', value: 'cpp', judge0Key: 'cpp' },
];

export const DEFAULT_CODE_BY_LANGUAGE: Record<EditorLanguage, string> = {
  python: `def solve():
    pass

if __name__ == "__main__":
    solve()
`,
  java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {

    }
}
`,
  javascript: `function solve(input) {
  return "";
}

const fs = require("fs");
const input = fs.readFileSync(0, "utf8");
const output = solve(input);
if (output !== undefined) {
  process.stdout.write(String(output));
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    return 0;
}
`,
};
