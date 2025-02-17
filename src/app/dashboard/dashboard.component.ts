import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Hero } from '../hero.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeroSearchComponent } from '../hero-search/hero-search.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeroSearchComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
    // Nos suscribimos al observable del servicio para recibir los héroes actualizados
    this.heroService.getHeroesUpdated().subscribe(heroes => {
      this.heroes = heroes.slice(0, 5); 
    });

  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => {
        // Generar 10 índices aleatorios dentro del rango de la longitud del array de héroes
        const randomHeroes = this.getRandomHeroes(heroes, 5);
        this.heroes = randomHeroes;
      });
  }

  getRandomHeroes(allHeroes: Hero[], count: number): Hero[] {
    const randomHeroes = [];
    const indicesElegidos = new Set<number>();

    while (randomHeroes.length < count) {
      const randomIndex = Math.floor(Math.random() * allHeroes.length);
      
      // Asegurarnos de no repetir héroes
      if (!indicesElegidos.has(randomIndex)) {
        randomHeroes.push(allHeroes[randomIndex]);
        indicesElegidos.add(randomIndex);
      }
    }

    return randomHeroes;
  }
}
