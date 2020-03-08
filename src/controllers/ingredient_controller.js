const ingredientController = {
  recupererUnIngredient: async id => {
    const ingredient = await Ingredient.findByPk(id, {
      attributes: ["nom"]
    });
    return ingredient;
  }
};
