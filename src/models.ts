import {date} from "yup";

export interface ISalle {
    noSalle : number
    capacite : null | number
    description : null | string
    estActif : boolean
    creerParAdministrateurCourriel: null | string
    creerParAdministrateurCourrielNavigation? : null | string
    reservations? : string[]
    nomActivites? : IActivite[]
}

export interface IActivite {
    nomActivite : string
    description : string
    estActif : boolean
    creerParAdministrateurCourriel : string
    creerParAdministrateurCourrielNavigation? : null | string
    reservations? : string[]
    noSalles? : string[]
}

export interface IPerson {
    courriel: null | string
    nom: null | string
    prenom: null | string
}

export interface IMembre {
    courriel : string
    adresse : null | string
    province : null | string
    codePostal : null | string
    telephone : null | string
    estActif : null | boolean
    etatModifierParAdministrateurCourriel : null | string
    courrielNavigation : IPerson
    etatModifierParAdministrateurCourrielNavigation : string[]
    invitations : string[]
    plaintes : string[]
    reservations : string[]
}

export interface IPlainte {
    noReservation : number
    membreCourriel : null | string
    datePlainte : string
    description : null | string
    administrateurCourriel: null | string
}

export interface IReservation {
    noReservation?: number
    dateHeureDebut: string
    dateHeureFin: string
    traiterParAdministrateurCourriel?: null | string
    invitations?: IInvitation[]
    traiterLe?: null | string
    idEtatReservation:number
    creerParMembreCourriel: string
    noSalle: number
    nomActivite: string
    lstIntivites?: string[]
    invitationsAjoutee?: string[]
    invitationsSupremee?: string[]
}
export interface IActiviteProps{
    activiteList?: IActivite[]
    onDisable?(nomActivite: string):void
}

export interface IMembreTableProps {
    membreList?: IMembre[]
    onDisable?(courriel: string):void
}

export interface IOfficeTableProps {
    salleList?: ISalle[]
    onDisable?(noSalle: number):void
}
export interface IPlainteProps{
    plainteList?: IPlainte[]
    onDisable?(nomPlainte: string):void
}


export interface IAutorisation {
    email: null | string
    password: null | string
}
export interface ITime {
    date: string
    disabled: boolean
}

export interface IInvitation {
    noReservation: number
    membreCourriel: string
    idEtatInvitation: number
    nomEtatInvitation?: string
    dateReponse?: string
    idEtatInvitationNavigation?: string
    membreCourrielNavigation?: string
    noReservationNavigation?: string
}