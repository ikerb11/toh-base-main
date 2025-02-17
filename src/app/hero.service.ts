import { Injectable } from '@angular/core';
import { Hero } from './hero.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, forkJoin  } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private apiUrl = 'https://gateway.marvel.com/v1/public/characters';
  private apiKey = '06fe3b690c58704232529bd37f007479';
  private limit = 100;
  private heroesUpdated = new Subject<Hero[]>();
  constructor(
    private http: HttpClient
  ) { }

  public getHeroes(): Observable<Hero[]> {
    return this.http.get<any>(`${this.apiUrl}?apikey=${this.apiKey}`).pipe(
      map(response => response.data.results.map((hero: any) => ({
        id: hero.id,
        name: hero.name,
        thumbnail: `${hero.thumbnail.path}.${hero.thumbnail.extension}`
      })))
    );
  }

  public getHero(id: number): Observable<Hero> {
    return this.http.get<any>(`${this.apiUrl}/${id}?apikey=${this.apiKey}`).pipe(
      map(response => {
        // Aquí estamos comprobando la respuesta completa de la API
        console.log('Respuesta completa de la API:', response);
  
        // Procesamos la respuesta como lo haces en el código original
        const hero = response.data.results[0];
  
        return {
          id: hero.id,
          name: hero.name,
          thumbnail: `${hero.thumbnail.path}.${hero.thumbnail.extension}`
        };
      })
    );
  }

    getAllHeroes(): Observable<Hero[]> {
      // Hacemos una petición para obtener cuántos héroes existen
      return this.http.get<any>(`${this.apiUrl}?apikey=${this.apiKey}&limit=1`).pipe(
        map(response => {
          const totalHeroes = response.data.total; // Número total de héroes en Marvel
          const requests = [];
          
          // Calculamos cuántas peticiones necesitamos para obtener todos
          for (let offset = 0; offset < totalHeroes; offset += this.limit) {
            requests.push(this.http.get<any>(`${this.apiUrl}?apikey=${this.apiKey}&limit=${this.limit}&offset=${offset}`));
          }
          
          // Hacemos todas las peticiones en paralelo
          return forkJoin(requests).pipe(
            map(responses => responses.flatMap(res => res.data.results.map((hero: any) => ({
              id: hero.id,
              name: hero.name,
              thumbnail: `${hero.thumbnail.path}.${hero.thumbnail.extension}`
            }))))
          );
        })
      ).pipe(switchMap(obs => obs)); // Para devolver directamente el array de héroes
    }
  

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<any>(`${this.apiUrl}?nameStartsWith=${term}&apikey=${this.apiKey}`).pipe(
      map(response => response.data.results.map((hero: any) => ({
        id: hero.id,
        name: hero.name,
        thumbnail: `${hero.thumbnail.path}.${hero.thumbnail.extension}`
      })))
    );
  }
    // Método para obtener el observable que emite los héroes
    getHeroesUpdated(): Observable<Hero[]> {
      return this.heroesUpdated.asObservable();
    }
  
    // Método para actualizar los héroes que se emiten a través del Subject
    updateHeroes(heroes: Hero[]): void {
      this.heroesUpdated.next(heroes);
    }
}
