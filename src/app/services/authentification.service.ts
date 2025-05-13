import {Injectable} from '@angular/core';
import User from '../interfaces/user';
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class AuthentificationService {
    private currentUserSubject: BehaviorSubject<User>;

    constructor() {
        this.currentUserSubject = new BehaviorSubject<User>(null);
    }

    public get currentUser(): Observable<User> {
        return this.currentUserSubject.asObservable();
    }

}
