import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GitHubUser } from '../github-user.interface';
import { Repository } from '../repository.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  getUser(githubUsername: string): Observable<GitHubUser> {
    return this.httpClient.get<GitHubUser>(`https://api.github.com/users/${githubUsername}`);
  }

  getRepositories(githubUsername: string): Observable<Repository[]> {
    return this.httpClient.get<Repository[]>(`https://api.github.com/users/${githubUsername}/repos`);
  }

  getLanguages(owner: string, repo: string): Observable<any> {
    return this.httpClient.get(`https://api.github.com/repos/${owner}/${repo}/languages`);
  }
}
