function removeDuplicate(tableau) {
  tableau.sort((a, b) => {
    return a.nom.localeCompare(b.nom);
  });
  //console.log(tableau);
  for (let i = 1; i < tableau.length; i++) {
    if (tableau[i - 1].nom === tableau[i].nom) {
      tableau.splice(i, 1);
    } else {
      i++;
    }
  }
  return tableau;
}

module.exports = removeDuplicate;
