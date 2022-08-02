const queryy =require("./db_query");

exports.getall=(req,res)=>{
    const sql="select * from plan_comptable";
    queryy.sql_request(sql,null,res);
 
}
//commet
exports.insert=(req,res)=>{
    const values=[[[req.body.nom_du_fichier,
                    req.body.type_de_donnees,
                    req.body.intitule,
                    req.body.numero_compte,
                    req.body.type_de_fichier,
                    req.body.delimiteur_enregistrement,
                    req.body.delimiteur_champ,
                    req.body.origine_fichier,
                    req.body.nombre_de_decimales,
                    req.body.separateur_decimales,
                    req.body.cadrage,
                    req.body.separateur_miliers,
                    req.body.caractere_remplissage,
                    req.body.debut_enregistrement,
                    req.body.entete_du_fichier,
                    req.body.id_societe ,]]];
                   
                    //
    const sql="insert into plan_comptable (nom_du_fichier,type_de_donnees, intitule, numero_compte, type_de_fichier, delimiteur_enregistrement, delimiteur_champ,  origine_fichier,nombre_de_decimales, separateur_decimales, cadrage,separateur_miliers,caractere_remplissage, debut_enregistrement, entete_du_fichier,id_societe ) values ?";
    
    queryy.sql_request(sql,values,res);
    console.log("add");
}

exports.update=(req,res)=>{
    const values=[req.body.nom_du_fichier,
        req.body.type_de_donnees,
        req.body.intitule,
        req.body.numero_compte,
        req.body.type_de_fichier,
        req.body.delimiteur_enregistrement,
        req.body.delimiteur_champ,
        req.body.origine_fichier,
        req.body.nombre_de_decimales,
        req.body.separateur_decimales,
        req.body.cadrage,
        req.body.separateur_miliers,
        req.body.caractere_remplissage,
        req.body.debut_enregistrement,
        req.body.entete_du_fichier,
        req.body.id_societe ,
        req.body.id_comptable
    ];
    const sql="UPDATE `plan_comptable` SET nom_du_fichier = ? , type_de_donnees = ? , intitule = ? , numero_compte = ? ,type_de_fichier = ? , delimiteur_enregistrement = ? , delimiteur_champ = ? , origine_fichier = ? , nombre_de_decimales = ? , separateur_decimales= ? , cadrage= ? , separateur_miliers= ? , caractere_remplissage = ? , debut_enregistrement = ? , entete_du_fichier = ?, id_societe  = ? WHERE id_comptable = ?";
    queryy.sql_request(sql,values,res);
}

exports.delete=(req,res)=>{
    const values=[req.params.id];
    console.log(values)
    const sql="delete from plan_comptable where id_comptable = ?";
    queryy.sql_request(sql,values,res);
}
exports.update2=(req,res)=>{
    const {nom_societe,domaine_societe,id_societe}=req.body;

    const values=[nom_societe,domaine_societe,id_societe];
    const sql="UPDATE societe SET nom_societe = ?, domaine_societe = ? WHERE id_societe = ?";
    queryy.sql_request(sql,values,res);
}

exports.update=(req,res)=>{
    const {nom_societe,domaine_societe,id_societe}=req.body;

    const values=[nom_societe,domaine_societe,id_societe];
    const sql="UPDATE societe SET nom_societe = ?, domaine_societe = ? WHERE id_societe = ?";
    queryy.sql_request(sql,values,res);
}