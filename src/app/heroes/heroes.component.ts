import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Hero } from '../hero.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeroSearchComponent } from '../hero-search/hero-search.component';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeroSearchComponent],
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = []; // Lista completa de héroes (cargados progresivamente)
  paginatedHeroes: Hero[] = []; // Héroes de la página actual
  pageSize: number = 20; // Héroes por página
  currentPage: number = 0; // Página actual
  totalPages: number = 0; // Total de páginas

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getAllHeroes().subscribe(newHeroes => {

      this.heroes = [...this.heroes, ...newHeroes];
      this.totalPages = Math.ceil(this.heroes.length / this.pageSize);

      if (this.currentPage === 0) {
        this.updatePagination();
      }
    });
  }

  updatePagination(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedHeroes = this.heroes.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.heroes.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}
