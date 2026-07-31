import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animated-counter',
  standalone: true,
  imports: [CommonModule],
  template: `<span>{{ prefix }}{{ displayValue }}{{ suffix }}</span>`
})
export class AnimatedCounterComponent implements OnInit, OnChanges {
  @Input() value: number = 0;
  @Input() duration: number = 1000;
  @Input() prefix: string = '';
  @Input() suffix: string = '';

  displayValue: number = 0;

  ngOnInit(): void {
    this.animate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && !changes['value'].firstChange) {
      this.animate();
    }
  }

  private animate(): void {
    const start = 0;
    const end = Number(this.value) || 0;
    const startTime = performance.now();

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      
      // Easing function outQuad
      const easeProgress = progress * (2 - progress);
      this.displayValue = Math.floor(start + (end - start) * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        this.displayValue = end;
      }
    };

    requestAnimationFrame(update);
  }
}
