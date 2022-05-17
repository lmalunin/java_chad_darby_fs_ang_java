import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';


@Injectable({
    providedIn: 'root'
})
export class Luv2ShopFormService {

    private countrtiesUrl: string = 'http://localhost:8080/api/countires';
    private statesUrl: string = 'http://localhost:8080/api/states';

    constructor(private _httpClient: HttpClient) {
    }

    getCountries(): Observable<Country[]> {
        return this._httpClient.get<GetResponseCountries>(this.countrtiesUrl)
            .pipe(
                map(response => response._embedded.countries)
            )
    }

    getStates(theCountryCode: string): Observable<State[]> {

        const searchStateUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

        return this._httpClient.get<GetResponseStates>(searchStateUrl)
            .pipe(
                map(response => response._embedded.states)
            )
    }

    getCreditCardMonths(startMonth: number): Observable<number[]> {
        let data: number[] = [];

        for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
            data.push(theMonth);
        }

        return of(data);
    }

    getCreditCardYears(): Observable<number[]> {
        let data: number[] = [];

        const startYear: number = new Date().getFullYear();
        const endYear: number = new Date().getFullYear() + 10;


        for (let theYear = startYear; theYear <= endYear; theYear++) {
            data.push(theYear);
        }

        return of(data);
    }

}

interface GetResponseCountries {
    _embedded: {
        countries: Country[]
    }
}

interface GetResponseStates {
    _embedded: {
        states: State[]
    }
}