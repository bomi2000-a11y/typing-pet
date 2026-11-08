// 모든 화면 맨 아래: 제작자와 저작권 표시
import { APP_AUTHOR, COPYRIGHT_YEAR } from '../config.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <span>제작 {APP_AUTHOR}</span>
      <span>© {COPYRIGHT_YEAR} {APP_AUTHOR}. All rights reserved.</span>
    </footer>
  );
}
