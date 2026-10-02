// file: lib/lab/samples/index.ts
export interface CodeSample {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
}

export const samples: CodeSample[] = [
  // JavaScript
  {
    id: "js-1",
    language: "javascript",
    title: "Array Metodları",
    description: "Map, filter, və reduce istifadəsi",
    code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\n// Cüt rəqəmləri seç\nconst evens = numbers.filter(n => n % 2 === 0);\nconsole.log("Cüt:", evens);\n\n// Kvadratlarını tap\nconst squares = evens.map(n => n * n);\nconsole.log("Kvadratlar:", squares);\n\n// Cəmini tap\nconst sum = squares.reduce((acc, curr) => acc + curr, 0);\nconsole.log("Ümumi cəm:", sum);`
  },
  {
    id: "js-2",
    language: "javascript",
    title: "Asinxron Fetch",
    description: "Xarici API-dən məlumat çəkmək",
    code: `async function fetchUsers() {\n  try {\n    console.log("Məlumat yüklənir...");\n    const res = await fetch("https://jsonplaceholder.typicode.com/users?_limit=3");\n    const data = await res.json();\n    \n    console.log("İstifadəçilər:");\n    data.forEach(user => {\n      console.log(\`- \${user.name} (\${user.email})\`);\n    });\n  } catch (err) {\n    console.error("Xəta baş verdi:", err);\n  }\n}\n\nfetchUsers();`
  },
  // Python
  {
    id: "py-1",
    language: "python",
    title: "List Comprehension",
    description: "Sürətli array əməliyyatları",
    code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\n# Cüt rəqəmlərin kvadratı\nsquares = [n**2 for n in numbers if n % 2 == 0]\n\nprint("Orijinal:", numbers)\nprint("Cütlərin Kvadratı:", squares)`
  },
  {
    id: "py-2",
    language: "python",
    title: "Siniflər (Classes)",
    description: "OOP prinsipləri",
    code: `class Developer:\n    def __init__(self, name, lang):\n        self.name = name\n        self.lang = lang\n        \n    def introduce(self):\n        return f"Salam, mən {self.name}. {self.lang} dilində kod yazıram."\n\ndev1 = Developer("Naill", "Python/JS")\nprint(dev1.introduce())`
  },
  // SQL
  {
    id: "sql-1",
    language: "sql",
    title: "Cədvəl Əlaqələri (JOIN)",
    description: "İki cədvəli birləşdirmək",
    code: `CREATE TABLE users (id INT, name TEXT, department_id INT);\nINSERT INTO users VALUES (1, 'Naill', 1), (2, 'Ali', 2), (3, 'Vəli', 1);\n\nCREATE TABLE departments (id INT, dept_name TEXT);\nINSERT INTO departments VALUES (1, 'IT'), (2, 'HR');\n\nSELECT u.name, d.dept_name\nFROM users u\nJOIN departments d ON u.department_id = d.id;`
  },
  // HTML
  {
    id: "html-1",
    language: "html",
    title: "Card Dizaynı (Tailwind)",
    description: "HTML və daxili CSS ilə kart",
    code: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { font-family: system-ui; background: #09090b; color: white; display: grid; place-items: center; height: 100vh; margin: 0; }\n  .card { background: #18181b; padding: 2rem; border-radius: 1rem; border: 1px solid #27272a; max-width: 300px; }\n  .badge { background: #4f46e5; padding: 0.2rem 0.6rem; border-radius: 99px; font-size: 0.8rem; font-weight: bold; }\n  h2 { margin: 1rem 0 0.5rem; }\n  p { color: #a1a1aa; font-size: 0.9rem; line-height: 1.5; }\n</style>\n</head>\n<body>\n  <div class="card">\n    <span class="badge">YENİ</span>\n    <h2>Gözəl Kart Dizaynı</h2>\n    <p>Bu sadəcə HTML və CSS istifadə edərək hazırlanmış müasir bir kart dizaynıdır. Playground vasitəsilə dərhal test edə bilərsiniz.</p>\n  </div>\n</body>\n</html>`
  }
];

// ✅ Verified: Export predefined code samples
