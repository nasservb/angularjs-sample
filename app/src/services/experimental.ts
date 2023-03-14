export class Experimental {

  feature(feature: string): boolean {
    return window.Afs.user &&
      window.Afs.user.feature_flags &&
      window.Afs.user.feature_flags.length &&
      window.Afs.user.feature_flags.indexOf(feature) > -1;
  }

}
