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
  heroes: Hero[] = []; // Lista completa de héroes
  paginatedHeroes: Hero[] = []; // Héroes de la página actual
  pageSize: number = 20; // Número de héroes por página
  currentPage: number = 0; // Página actual
  totalPages: number = 0; // Número total de páginas

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getAllHeroes().subscribe(heroes => {
      this.heroes = heroes;
      this.totalPages = Math.ceil(this.heroes.length / this.pageSize);
      this.updatePagination();
    });
  }

  updatePagination(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedHeroes = this.heroes.slice(startIndex, endIndex);
  }

  previousPage(): void {
    this.currentPage = (this.currentPage - 1 + this.totalPages) % this.totalPages;
    this.updatePagination();
  }

  nextPage(): void {
    this.currentPage = (this.currentPage + 1) % this.totalPages;
    this.updatePagination();
  }
}
