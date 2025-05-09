import {Injectable} from '@angular/core';
import User from '../interfaces/user';
import {BehaviorSubject, empty, Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {map} from 'rxjs/internal/operators/map';
import {catchError} from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class AuthentificationService {
    private currentUserSubject: BehaviorSubject<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(null);
    }

    public get currentUser(): Observable<User> {
        return this.currentUserSubject.asObservable();
    }

    authenticate() {
        return this.http.get<any>(`${environment.userinfo_url}`, {withCredentials: true})
                .pipe(
                    map((user: User) => {
                        this.currentUserSubject.next(user);
                        return user;
                    }),
                    catchError( (err: HttpErrorResponse) =>  {
                        this.currentUserSubject.next(null);
                        return empty();
                    })
                );
    }
}
