import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Luv2ShopFormService {

    private counrtiesUrl: string = 'http://localhost:8080/api/countires';
    private statesUrl: string = 'http://localhost:8080/api/states';

    constructor(private _httpClient: HttpClient) {
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
