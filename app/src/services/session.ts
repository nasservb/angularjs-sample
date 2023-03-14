/**
 * Sesions
 */
import { EventEmitter, ReflectiveInjector } from '@angular/core';

export class Session {

  loggedinEmitter: EventEmitter<any> = new EventEmitter();
  userEmitter: EventEmitter<any> = new EventEmitter();

  static _() {
    return new Session();
  }

	/**
	 * Return if loggedin, with an optional listener
	 */
  isLoggedIn(observe: any = null) {

    if (observe) {
      this.loggedinEmitter.subscribe({
        next: (is) => {
          if (is)
            observe(true);
          else
            observe(false);
        }
      });
    }

    if (window.Afs.LoggedIn)
      return true;

    return false;
  }

  isAdmin() {
    if (!this.isLoggedIn)
      return false;
    if (window.Afs.Admin)
      return true;

    return false;
  }



    //*
    //*****detect public user in front
    //*******niazy 
    //*******1396-08-09
    //**** 

  isPublic() {
    if (!this.isLoggedIn)
      return false;
    if (window.Afs.Public)
      return true;

    return false;
  }

	/**
	 * Get the loggedin user
	 */
  getLoggedInUser(observe: any = null) {

    if (observe) {
      this.userEmitter.subscribe({
        next: (user) => {
          observe(user);
        }
      });
    }

    if (window.Afs.user)
      return window.Afs.user;

    return false;
  }

	/**
	 * Emit login event
	 */
  login(user: any = null) {
    //clear stale local storage
    window.localStorage.clear();
    this.userEmitter.next(user);
    window.Afs.user = user;
    if (user.admin === true)
      window.Afs.Admin = true;
    window.Afs.LoggedIn = true;
    this.loggedinEmitter.next(true);
  }

	/**
	 * Emit logout event
	 */
  logout() {
    this.userEmitter.next(null);
    delete window.Afs.user;
    window.Afs.LoggedIn = false;
    window.localStorage.clear();
    this.loggedinEmitter.next(false);
  }

}

export class SessionFactory {
  // @todo: migrate to regular Angular DI
  static instance;

  static build() {
    if (!SessionFactory.instance) {
      let providers = ReflectiveInjector.resolve([Session]),
        injector = ReflectiveInjector.fromResolvedProviders(providers);

      SessionFactory.instance = injector.get(Session);
    }

    return SessionFactory.instance;
  }
}
