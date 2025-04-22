import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private p5: any;
  private bolas: any[] = [];
  private futeimagem: any;
  private rugbyimagem: any;
  private basqueteimagem: any;
  private futeSom: any;
  private rugbySom: any;
  private basqueteSom: any;
  private volumeSlider: any;
  private isSimulationRunning = false;
  private soundsLoaded = false;

  constructor() {}

  ngOnInit() {
    this.createP5Canvas();
  }

  private createP5Canvas() {
    this.p5 = new p5((p: any) => {
      p.preload = () => {
        console.log('Iniciando carregamento dos recursos...');
        
        // Carregando imagens
        this.futeimagem = p.loadImage('assets/Imagens/futebol.png', 
          () => console.log('Imagem futebol carregada'),
          (err: any) => console.error('Erro ao carregar imagem futebol:', err)
        );
        this.rugbyimagem = p.loadImage('assets/Imagens/rugby.png',
          () => console.log('Imagem rugby carregada'),
          (err: any) => console.error('Erro ao carregar imagem rugby:', err)
        );
        this.basqueteimagem = p.loadImage('assets/Imagens/basquete.png',
          () => console.log('Imagem basquete carregada'),
          (err: any) => console.error('Erro ao carregar imagem basquete:', err)
        );

        // Carregando sons
        try {
          this.futeSom = p.loadSound('assets/Som/futebol.mp3',
            () => {
              console.log('Som futebol carregado');
              this.checkSoundsLoaded();
            },
            (err: any) => console.error('Erro ao carregar som futebol:', err)
          );
          this.rugbySom = p.loadSound('assets/Som/rugby.mp3',
            () => {
              console.log('Som rugby carregado');
              this.checkSoundsLoaded();
            },
            (err: any) => console.error('Erro ao carregar som rugby:', err)
          );
          this.basqueteSom = p.loadSound('assets/Som/basquete.mp3',
            () => {
              console.log('Som basquete carregado');
              this.checkSoundsLoaded();
            },
            (err: any) => console.error('Erro ao carregar som basquete:', err)
          );
        } catch (error) {
          console.error('Erro ao carregar sons:', error);
        }
      };

      p.setup = () => {
        const canvas = p.createCanvas(600, 400);
        canvas.parent('canvas-container');
        p.imageMode(p.CENTER);
        p.rectMode(p.CENTER);
        
        this.volumeSlider = document.getElementById('volume');
        if (this.volumeSlider) {
          this.volumeSlider.addEventListener('input', () => this.atualizarVolume(p));
        }

        document.getElementById('addfutebol')?.addEventListener('click', () => this.addBola('futebol', p));
        document.getElementById('addrugby')?.addEventListener('click', () => this.addBola('rugby', p));
        document.getElementById('addbasquete')?.addEventListener('click', () => this.addBola('basquete', p));
        document.getElementById('clearAll')?.addEventListener('click', () => this.limparBolas(p));

        // Configuração inicial do volume
        this.atualizarVolume(p);
        p.noLoop();
      };

      p.draw = () => {
        p.background('#8bc34a');
        
        p.textAlign(p.LEFT);
        p.textSize(12);
        p.fill(0);
        p.text(`Bolas: ${this.bolas.length} - Frame: ${p.frameCount}`, 10, 20);

        if (!this.isSimulationRunning) {
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(24);
          p.fill(0);
          p.text("Adicione uma bola para iniciar", p.width/2, p.height/2);
          return;
        }

        this.bolas.forEach(bola => {
          this.atualizarBola(bola, p);
          this.exibirBola(bola, p);
        });

        this.verificarColisoes(p);
      };
    });
  }

  private checkSoundsLoaded() {
    if (this.futeSom && this.rugbySom && this.basqueteSom) {
      this.soundsLoaded = true;
      console.log('Todos os sons foram carregados!');
      this.atualizarVolume(this.p5);
    }
  }

  private atualizarVolume(p: any) {
    if (!this.soundsLoaded) {
      console.log('Sons ainda não carregados completamente');
      return;
    }
    
    const volume = this.volumeSlider ? parseFloat(this.volumeSlider.value) : 0.5;
    console.log('Atualizando volume para:', volume);
    
    try {
      if (this.futeSom && this.futeSom.setVolume) {
        this.futeSom.setVolume(volume);
      }
      if (this.rugbySom && this.rugbySom.setVolume) {
        this.rugbySom.setVolume(volume);
      }
      if (this.basqueteSom && this.basqueteSom.setVolume) {
        this.basqueteSom.setVolume(volume);
      }
    } catch (error) {
      console.error('Erro ao ajustar volume:', error);
    }
  }

  private tocarSom(tipo: string) {
    if (!this.soundsLoaded) {
      console.log('Sons ainda não carregados completamente');
      return;
    }

    try {
      let som = null;
      if (tipo === 'futebol') {
        som = this.futeSom;
      } else if (tipo === 'rugby') {
        som = this.rugbySom;
      } else if (tipo === 'basquete') {
        som = this.basqueteSom;
      }

      if (som && som.isLoaded() && !som.isPlaying()) {
        som.play();
      }
    } catch (error) {
      console.error('Erro ao tocar som:', error);
    }
  }

  private addBola(tipo: string, p: any) {
    const x = p.random(50, p.width - 50);
    const y = p.random(50, p.height - 50);
    let tamanho;
    if (tipo === 'futebol') {
      tamanho = p.random(40, 60);
    } else if (tipo === 'rugby') {
      tamanho = p.random(60, 80);
    } else if (tipo === 'basquete') {
      tamanho = p.random(50, 70);
    }
    const velX = p.random(-2, 2);
    const velY = p.random(-2, 2);
    this.bolas.push({ x, y, tamanho, velX, velY, tipo, rotacao: 0, velocidadeRotacao: tipo === 'rugby' ? p.random(-0.05, 0.05) : p.random(-0.02, 0.02), colliding: false, escala: 1 });
    this.tocarSom(tipo);

    if (this.bolas.length === 1) {
      this.isSimulationRunning = true;
      p.loop();
    }
  }

  private limparBolas(p: any) {
    this.bolas = [];
    this.isSimulationRunning = false;
    p.noLoop();
  }

  private verificarColisoes(p: any) {
    for (let i = 0; i < this.bolas.length; i++) {
      for (let j = i + 1; j < this.bolas.length; j++) {
        if (this.verificarColisao(this.bolas[i], this.bolas[j], p)) {
          const velXTemp = this.bolas[i].velX;
          const velYTemp = this.bolas[i].velY;
          this.bolas[i].velX = this.bolas[j].velX;
          this.bolas[i].velY = this.bolas[j].velY;
          this.bolas[j].velX = velXTemp;
          this.bolas[j].velY = velYTemp;
          this.bolas[i].colliding = true;
          this.bolas[j].colliding = true;
          
          // Tocar som na colisão
          this.tocarSom(this.bolas[i].tipo);
          
          setTimeout(() => {
            if (this.bolas[i]) this.bolas[i].colliding = false;
            if (this.bolas[j]) this.bolas[j].colliding = false;
          }, 200);
        }
      }
    }
  }

  private verificarColisao(bola1: any, bola2: any, p: any) {
    const distancia = p.dist(bola1.x, bola1.y, bola2.x, bola2.y);
    const distanciaMinima = (bola1.tamanho + bola2.tamanho) / 2;
    return distancia < distanciaMinima * 0.8;
  }

  private atualizarBola(bola: any, p: any) {
    bola.x += bola.velX;
    bola.y += bola.velY;

    if (bola.x < bola.tamanho / 2 || bola.x > p.width - bola.tamanho / 2) {
      bola.velX *= -1;
      bola.x = p.constrain(bola.x, bola.tamanho / 2, p.width - bola.tamanho / 2);
      this.tocarSom(bola.tipo);
    }

    if (bola.y < bola.tamanho / 2 || bola.y > p.height - bola.tamanho / 2) {
      bola.velY *= -1;
      bola.y = p.constrain(bola.y, bola.tamanho / 2, p.height - bola.tamanho / 2);
      this.tocarSom(bola.tipo);
    }

    bola.rotacao += bola.velocidadeRotacao;
    bola.escala = bola.colliding ? 1.2 : 1 + p.sin(p.frameCount * 0.05) * 0.05;
  }

  private exibirBola(bola: any, p: any) {
    p.push();
    p.translate(bola.x, bola.y);
    p.rotate(bola.rotacao);
    p.scale(bola.escala);

    if (bola.tipo === 'futebol' && this.futeimagem) {
      p.image(this.futeimagem, 0, 0, bola.tamanho, bola.tamanho);
    } else if (bola.tipo === 'rugby' && this.rugbyimagem) {
      p.image(this.rugbyimagem, 0, 0, bola.tamanho * 1.6, bola.tamanho);
    } else if (bola.tipo === 'basquete' && this.basqueteimagem) {
      p.image(this.basqueteimagem, 0, 0, bola.tamanho, bola.tamanho);
    }
    p.pop();
  }
} 