import {Injectable} from '@angular/core';
import {addDoc, collection, collectionData, doc, docData, Firestore, updateDoc} from '@angular/fire/firestore';
import {from, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbConnectorService {

  constructor(private firestore: Firestore) {
  }

  // Idk if should be used at all
  // public getAllUsers(): Observable<any[]> {
  //   const itemsCollection = collection(this.firestore, 'items');
  //   return collectionData(itemsCollection, { idField: 'id' });
  // }

  public getUserById(id: string): Observable<any> {
    const userDocRef = doc(this.firestore, `items/${id}`);
    return docData(userDocRef, { idField: 'id' });
  }

  public addUser(item: any): Observable<any> {
    const itemsCollection = collection(this.firestore, 'items');
    return of(addDoc(itemsCollection, item));
  }

  public updateUserById(id: string, updatedData: any): Observable<void> {
    const itemDocRef = doc(this.firestore, `items/${id}`);
    return from(updateDoc(itemDocRef, updatedData));
  }
}
