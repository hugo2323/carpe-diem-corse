// Modèle de données d'un avis. Le front n'affiche QUE les avis is_verified=true
// provenant d'une source réelle. Aucune donnée inventée.

export type ReviewSource = "airbnb" | "turo" | "manual_verified";

export type Review = {
  id: string;
  source: ReviewSource;
  rating: number; // note de l'avis (sur 5)
  author_name: string;
  review_text: string;
  review_date: string; // ISO YYYY-MM-DD
  source_url: string; // lien vers l'avis / l'annonce
  is_verified: boolean; // seul true est affiché
  fetched_at: string; // ISO — quand l'avis a été récupéré
};
