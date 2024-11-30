import { createSignal } from "solid-js";
import "./ThemeToggle.css"; // Ensure this path is correct

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = createSignal(false);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode());
    document.documentElement.setAttribute("data-theme", isDarkMode() ? "dark" : "light");
  };

  return (
    <label for="theme" class="theme">
      <span class="theme__toggle-wrap">
        <input
          id="theme"
          class="theme__toggle"
          type="checkbox"
          role="switch"
          name="theme"
          value="dark"
          checked={isDarkMode()}
          onInput={handleToggle}
        />
        <span class="theme__icon">
          {[...Array(9)].map((_, index) => (
            <span class="theme__icon-part"></span>
          ))}
        </span>
      </span>
    </label>
  );
}

export default ThemeToggle;
