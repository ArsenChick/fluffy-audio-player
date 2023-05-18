import { Route } from "@angular/router";
import { MainComponent } from "./routes/main/main.component";
import { PlaylistComponent } from "./routes/playlist/playlist.component";

export const appRoutes: Route[] = [
  { path: '', component: MainComponent, pathMatch: 'full' },
  { path: 'playlist', component: PlaylistComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];
