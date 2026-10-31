/**
 * Kiểm tra convention cho phần offline đã refactor.
 *
 * Dùng AST TypeScript thay vì tìm ký tự "?": optional chaining và nullish
 * coalescing hoàn toàn hợp lệ, còn ConditionalExpression (a ? b : c) bị cấm.
 * Arrow functions chỉ được cảnh báo vì yêu cầu là "hạn chế", không cấm tuyệt đối.
 */
import { readFileSync } from "node:fs";
import ts from "typescript";

const paths = [
  "src/app/_layout.tsx",
  "src/components/ui/collapsible.tsx",
  "src/features/startup/hooks/useStartup.ts",
  "src/features/offline/services/bundledAsset.ts",
  "src/features/offline/services/bundledMap.ts",
  "src/features/offline/services/bundledGlyphs.ts",
  "src/features/offline/hooks/useOfflineResources.ts",
  "src/features/offline/hooks/useDeviceStorage.ts",
  "src/features/offline/context/BundledMapContext.ts",
  "src/features/offline/constants/requiredMap.ts",
  "src/features/offline/components/OfflineScreen.tsx",
  "src/features/map/components/MapLibreMap.tsx",
  "src/features/map/components/MapController.tsx",
  "src/features/map/hooks/useUserLocation.ts",
];

let errorCount = 0;
let arrowCount = 0;

for (const path of paths) {
  const text = readFileSync(path, "utf8");
  const sourceFile = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);

  function inspect(node) {
    if (ts.isConditionalExpression(node)) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      console.error(path + ":" + (line + 1) + ":" + (character + 1) + " - Toán tử ba ngôi không được sử dụng.");
      errorCount += 1;
    }

    if (ts.isArrowFunction(node)) {
      arrowCount += 1;
      console.warn("Arrow function cần cân nhắc thay bằng hàm có tên: " + path);
    }

    ts.forEachChild(node, inspect);
  }

  inspect(sourceFile);
}

console.log("Offline style audit:", paths.length, "files,", arrowCount, "arrow functions,", errorCount, "ternary operators.");

if (errorCount > 0) {
  process.exitCode = 1;
}
