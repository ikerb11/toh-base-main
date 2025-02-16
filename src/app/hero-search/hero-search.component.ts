import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Hero } from '../hero.interface';
import { HeroService } from '../hero.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>; // Lista de héroes obtenidos de la búsqueda
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );

    // Actualizar los héroes en el servicio para que el Dashboard los reciba
    this.heroes$.subscribe(heroes => {
      this.heroService.updateHeroes(heroes);
    });
  }
}
