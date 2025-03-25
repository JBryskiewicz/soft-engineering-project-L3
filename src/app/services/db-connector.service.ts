import {Injectable} from '@angular/core';
import {addDoc, collection, doc, docData, Firestore, getDocs, query, updateDoc, where} from '@angular/fire/firestore';
import {from, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbConnectorService {

  constructor(private firestore: Firestore) {
  }

  public getUserByUsername(username: string): Observable<any> {
    const usersCollection = collection(this.firestore, 'items');
    const q = query(usersCollection, where('username', '==', username));

    return from(getDocs(q).then(snapshot => {
      if (!snapshot.empty) {
        return snapshot.docs[0].data(); // Returns the first matching user
      } else {
        throw new Error('User not found');
      }
    }));
  }

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
