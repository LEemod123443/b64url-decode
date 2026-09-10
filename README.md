# base64 URL auto-decoder

페이지 텍스트에 있는 base64 / base64url 인코딩 URL을 클릭 가능한 링크로 바꿔준다.

- `b64url.user.js` — Violentmonkey / Tampermonkey 유저스크립트
- `manifest.json` + `content.js` — Chrome 확장 (압축해제 로드)
- `index.html` — 설치 페이지 (GitHub Pages용)
- `test.mjs` — `node test.mjs`

## 배포 (GitHub Pages)

1. GitHub에서 빈 레포 `b64url-decode` 생성 (README 없이).
2. 이 폴더에서 `USER`를 본인 GitHub 아이디로 바꾸고 푸시:

   ```bash
   sed -i "s/USER/your-github-id/g" b64url.user.js
   git add -A && git commit -m "set urls"
   git remote add origin https://github.com/your-github-id/b64url-decode.git
   git push -u origin main
   ```

3. 레포 Settings → Pages → Source: `main` / `/ (root)` → Save.
4. 몇 분 뒤 `https://your-github-id.github.io/b64url-decode/` 접속 → **설치** 버튼.

## 더 간단히 (Gist)

새 Gist에 `b64url.user.js` 하나만 올리고, "Raw" 버튼 URL로 접속하면
Violentmonkey가 바로 설치창을 띄운다. (자동 업데이트 원하면 위 Pages 방식 사용)
