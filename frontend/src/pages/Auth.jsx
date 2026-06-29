import { useState , useEffect} from "react";
import "./Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: ""
});

const [error, setError] = useState("");

// ALLOW THE USER TO SEE HIS PASSSWORD
const [showPassword, setShowPassword] = useState(false);

// ---------------------------BACKGROUND----------------------------
useEffect(() => {

  const canvas =
    document.getElementById("plexus-canvas");

  const ctx =
    canvas.getContext("2d");

  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();

  window.addEventListener("resize", resize);

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    });
  }

  const mouse = {
    x: 0,
    y: 0
  };

  window.addEventListener(
    "mousemove",
    e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
  );

  function animate() {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    particles.forEach(p => {

      p.x += p.vx;
      p.y += p.vy;

      if (
        p.x < 0 ||
        p.x > canvas.width
      ) p.vx *= -1;

      if (
        p.y < 0 ||
        p.y > canvas.height
      ) p.vy *= -1;

      const dx =
        mouse.x - p.x;

      const dy =
        mouse.y - p.y;

      const dist =
        Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        p.x += dx * 0.0005;
        p.y += dy * 0.0005;
      }

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        2,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "#06B6D4";

      ctx.fill();

    });

    for (
      let i = 0;
      i < particles.length;
      i++
    ) {
      for (
        let j = i + 1;
        j < particles.length;
        j++
      ) {

        const dx =
          particles[i].x -
          particles[j].x;

        const dy =
          particles[i].y -
          particles[j].y;

        const distance =
          Math.sqrt(
            dx * dx + dy * dy
          );

        if (distance < 120) {

          ctx.beginPath();

          ctx.moveTo(
            particles[i].x,
            particles[i].y
          );

          ctx.lineTo(
            particles[j].x,
            particles[j].y
          );

          ctx.strokeStyle =
            `rgba(6,182,212,${
              1 - distance / 120
            })`;

          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(
      animate
    );
  }

  animate();

}, []);

// --------------------------------------------------------
function handleChange(e) {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
}

function validate() {

  if (!formData.email.trim()) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.email)) {
    return "Invalid email format";
  }

  if (formData.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  if (!isLogin && formData.name.trim().length < 3) {
    return "Name must be at least 3 characters";
  }

  return "";
}

function handleSubmit(e) {
  e.preventDefault();

  const validationError = validate();

  if (validationError) {
    setError(validationError);
    return;
  }

  setError("");

  onLogin();
}

  return (
    
    <div className="auth-container">

  <canvas id="plexus-canvas"></canvas>

  <div className="auth-card">

    <div className="brand-pane">

      <div className="logo-wrapper">

        <svg
          width="110"
          height="110"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="8" fill="#fff" />

          <line x1="50" y1="50" x2="20" y2="20" stroke="white" />
          <line x1="50" y1="50" x2="80" y2="20" stroke="white" />
          <line x1="50" y1="50" x2="20" y2="80" stroke="white" />
          <line x1="50" y1="50" x2="80" y2="80" stroke="white" />

          <circle cx="20" cy="20" r="5" fill="#fff" />
          <circle cx="80" cy="20" r="5" fill="#fff" />
          <circle cx="20" cy="80" r="5" fill="#fff" />
          <circle cx="80" cy="80" r="5" fill="#fff" />
        </svg>

        <div className="radar-glow"></div>

      </div>

      <h1>AI Code Reviewer</h1>

      <p>
        Intelligent code analysis,
        instant review,
        developer-first workflow.
      </p>

    </div>

    <div className="form-pane">

      <h2>
        {isLogin ? "Welcome Back" : "Create Account"}
      </h2>

      {error && (
        <p className="error">{error}</p>
      )}

      <form onSubmit={handleSubmit}>

        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />

        <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

          <span
            className="eye"
            onClick={() => setShowPassword(!showPassword)}
          >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
    </div>

        <button
          className="primary-btn"
          type="submit"
        >
          {isLogin ? "Login" : "Register"}
        </button>

      </form>

      <button className="github-btn">
        GitHub
      </button>

      <p
        className="switch"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Create an account"
          : "Already have an account?"}
      </p>

    </div>

  </div>

</div>
  );
}

export default Auth;