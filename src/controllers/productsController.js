const {existsSync, unlinkSync} = require('fs')
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		return res.render('products',{
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const product = products.find(product => product.id === +req.params.id)
		return res.render('detail',{
			...product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
        const ultimoId = products[products.length -1].id;
		const {name, price, discount, description, category} = req.body;

		const nuevoProducto = {
			id: ultimoId + 1,
			name: name.trim(),
			description: description.trim(),
			price: +price,
			discount: +discount,
			image: 'default-image.png',
			category: category,
		};

		products.push(nuevoProducto);

		fs.writeFileSync(productsFilePath, JSON.stringify(products), 'utf-8')

		return res.redirect('/products/detail/' + nuevoProducto.id);
	},

	// Update - Form to edit
	edit: (req, res) => {
		const product = products.find(product => product.id === +req.params.id)
		return res.render('product-edit-form', {
			...product
		})
	},
	// Update - Method to update
	update: (req, res) => {
		const {name, price, discount, description, category} = req.body;

        const productosActualizados = products.map(product => {
			if(product.id === +req.params.id){

			product.name= name.trim(),
			product.description= description.trim(),
			product.price= +price,
			product.discount= +discount,
			product.category= category,
			product.image= 'default-image.png'
			}

			return product
		})



		fs.writeFileSync(productsFilePath, JSON.stringify(productosActualizados), 'utf-8')

		return res.redirect('/products/detail/' + req.params.id);
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		
		const {id} = req.params;
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		
		const {image} = products.find(product => product.id == id);
		existsSync('public/images/products/' + image) && unlinkSync('public/images/products/' + image)


		
		const productsDelete = products.filter(product => product.id != id);
	
		fs.writeFileSync(productsFilePath,JSON.stringify(productsDelete),'utf-8')
	
		return res.redirect('/')

	}
};

module.exports = controller;