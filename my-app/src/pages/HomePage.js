import React, { useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import p5 from "p5";
import JestTesting from "../components/JestTesting";

function HomePage() {
  const p5ContainerRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let particles = [];

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight).parent(
          p5ContainerRef.current
        );
        p.noStroke();
        for (let i = 0; i < 100; i++) {
          particles.push(new Particle(p));
        }
      };

      p.draw = () => {
        p.background(30, 30, 60, 20);

        let centerX = p.width / 2;
        let centerY = p.height / 2;
        let time = p.millis() / 1000;
        let maxSize = 300 * p.noise(time);

        for (let i = 0; i < 10; i++) {
          let radius = (maxSize * (i + 1)) / 10;
          p.fill(
            150 + 100 * p.sin(time + i * 0.5),
            100 + 100 * p.cos(time + i * 0.8),
            200 + 50 * p.sin(time + i * 1.2)
          );
          p.ellipse(centerX, centerY, radius, radius);
        }

        let pulseSize = p.map(p.sin(p.frameCount * 0.1), -1, 1, 50, 200);
        p.fill(255, 800 + pulseSize, 150, 200);
        p.ellipse(p.mouseX, p.mouseY, pulseSize, pulseSize);

        for (let j = 0; j < 30; j++) {
          let sparkleX = p.random(p.width);
          let sparkleY = p.random(p.height);
          let sparkleSize = p.random(2, 5);
          p.fill(255, p.random(200, 255), p.random(200, 255), 150);
          p.ellipse(sparkleX, sparkleY, sparkleSize);
        }

        particles.forEach((particle) => {
          particle.update();
          particle.show();
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };

      class Particle {
        constructor(p) {
          this.p = p;
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
          this.acc = p.createVector(0, 0);
          this.size = p.random(2, 5);
        }

        update() {
          this.acc = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5));
          this.vel.add(this.acc);
          this.pos.add(this.vel);
          this.edges();
        }

        edges() {
          if (this.pos.x > this.p.width) this.pos.x = 0;
          if (this.pos.x < 0) this.pos.x = this.p.width;
          if (this.pos.y > this.p.height) this.pos.y = 0;
          if (this.pos.y < 0) this.pos.y = this.p.height;
        }

        show() {
          this.p.noStroke();
          this.p.fill(255, 255, 255, 150);
          this.p.ellipse(this.pos.x, this.pos.y, this.size);
        }
      }
    };

    const p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* <Typography variant="h7">The HomePage</Typography> */}
      {/* <JestTesting /> */}
      <div ref={p5ContainerRef} style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
}

export default HomePage;
