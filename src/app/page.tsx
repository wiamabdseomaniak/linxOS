/**
 * Page d'accueil — simple redirection vers la page de connexion.
 * Sert d'entrée par défaut de l'application.
 */
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
}