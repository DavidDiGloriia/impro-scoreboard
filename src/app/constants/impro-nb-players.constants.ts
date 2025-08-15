import {ImproNbPlayers} from "@enums/impro-nb-players.enum";

export const ImproNbPlayersLabel: { [value: string]: string } = {
  [ImproNbPlayers.UNLIMITED]: 'Illimité',
  [ImproNbPlayers.EVERYBODY]: 'Tous',
  [ImproNbPlayers.ONE]: '1 par équipe',
  [ImproNbPlayers.TWO]: '2 par équipe',
  [ImproNbPlayers.TWO_MAX]: '2 max par équipe',
  [ImproNbPlayers.THREE]: '3 par équipe',
  [ImproNbPlayers.THREE_MAX]: '3 max par équipe',
  [ImproNbPlayers.CUSTOM]: 'Personnalisé',
}
export const ImproNbPlayersShortLabel: { [value: string]: string } = {
  [ImproNbPlayers.UNLIMITED]: 'Illimité',
  [ImproNbPlayers.EVERYBODY]: 'Tous',
  [ImproNbPlayers.ONE]: '1/eq',
  [ImproNbPlayers.TWO]: '2/eq',
  [ImproNbPlayers.TWO_MAX]: '2 max/eq',
  [ImproNbPlayers.THREE]: '3/eq',
  [ImproNbPlayers.THREE_MAX]: '3 max/eq',
  [ImproNbPlayers.CUSTOM]: 'Personnalisé',
}
