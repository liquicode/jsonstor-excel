'use strict';

const LIB_FS = require( 'fs' );

const XLSX = require( 'xlsx' );

const jsongin = require( '@liquicode/jsongin' )();
const StorageBase = require( '../StorageBase' );
const MemoryStorage = require( './jsonstor-memory' );

module.exports = {

	AdapterName: 'jsonstor-excel',
	AdapterDescription: 'Documents are stored in an Excel spreadsheet file.',

	GetAdapter: function ( Settings )
	{


		//=====================================================================
		/*
			Settings = {
				Path: '', // Path to the Excel file storing the data.
				SheetName: '', // The name of the Excel Sheet storing the data.
				AutoFlush: true, // Flushes cached data to the storage on each insert, update, replace, or delete.
				HeaderRow: 0, // The row index of the header row.
				DataRow: 1, // The starting row index of the data rows.
				DataCol: 0, // The starting column index of the data.
			}
		*/
		if ( jsongin.ShortType( Settings ) !== 'o' ) { throw new Error( `This adapter requires a Settings parameter.` ); }
		if ( jsongin.ShortType( Settings.Path ) !== 's' ) { throw new Error( `This adapter requires a Settings.Path string parameter.` ); }
		if ( jsongin.ShortType( Settings.SheetName ) !== 's' ) { throw new Error( `This adapter requires a Settings.SheetName string parameter.` ); }
		if ( jsongin.ShortType( Settings.AutoFlush ) !== 'b' ) { Settings.AutoFlush = true; }
		// if ( jsongin.ShortType( Settings.HeaderRow ) !== 'n' ) { Settings.HeaderRow = 0; }
		// if ( jsongin.ShortType( Settings.DataRow ) !== 'n' ) { Settings.DataRow = 1; }
		// if ( jsongin.ShortType( Settings.DataCol ) !== 'n' ) { Settings.DataCol = 0; }


		//=====================================================================
		let Storage = StorageBase( this, Settings );
		Storage.MemoryStorage = MemoryStorage.GetAdapter( Settings );
		read_storage();


		//=====================================================================
		function read_storage()
		{
			Storage.MemoryStorage.store = [];
			if ( !LIB_FS.existsSync( Settings.Path ) ) { return; }
			let workbook = XLSX.readFile( Settings.Path );
			if ( !workbook.SheetNames.includes( Settings.SheetName ) ) { return; }
			let worksheet = workbook.Sheets[ Settings.SheetName ];
			Storage.MemoryStorage.store = XLSX.utils.sheet_to_json( worksheet, {} );
			return;
		}


		//=====================================================================
		function write_storage()
		{
			let workbook = null;
			if ( !LIB_FS.existsSync( Settings.Path ) )
			{
				workbook = XLSX.utils.book_new();
			}
			else
			{
				workbook = XLSX.readFile( Settings.Path );
			}
			let worksheet = XLSX.utils.json_to_sheet( Storage.MemoryStorage.store, {} );
			if ( !workbook.SheetNames.includes( Settings.SheetName ) )
			{
				XLSX.utils.book_append_sheet( workbook, worksheet, Settings.SheetName, false );
			}
			else
			{
				workbook.Sheets[ Settings.SheetName ] = worksheet;
			}
			XLSX.writeFile( workbook, Settings.Path );
			return;
		}


		//=====================================================================
		function drop_storage()
		{
			Storage.MemoryStorage.store = [];
			if ( !LIB_FS.existsSync( Settings.Path ) ) { return; }
			let workbook = XLSX.readFile( Settings.Path );
			if ( !workbook.SheetNames.includes( Settings.SheetName ) ) { return; }
			let index = workbook.SheetNames.indexOf( Settings.SheetName );
			workbook.SheetNames.splice( ( index, 1 ) );
			delete workbook.Sheets[ Settings.SheetName ];
			XLSX.writeFile( workbook, Settings.Path );
			return;
		}


		//=====================================================================
		// DropStorage
		//=====================================================================


		Storage.DropStorage = async function ( Options ) 
		{
			return new Promise(
				async ( resolve, reject ) =>
				{
					try
					{
						drop_storage();
						resolve( true );
						return;
					}
					catch ( error )
					{
						reject( error );
						return;
					}
					return;
				} );
		};


		//=====================================================================
		// FlushStorage
		//=====================================================================


		Storage.FlushStorage = async function ( Options ) 
		{
			return new Promise(
				async ( resolve, reject ) =>
				{
					try
					{
						write_storage();
						resolve( true );
						return;
					}
					catch ( error )
					{
						reject( error );
						return;
					}
					return;
				} );
		};


		//=====================================================================
		// Count
		//=====================================================================


		Storage.Count = async function ( Criteria, Options ) 
		{
			let results = await Storage.MemoryStorage.Count( Criteria, Options );
			return results;
		};


		//=====================================================================
		// InsertOne
		//=====================================================================


		Storage.InsertOne = async function ( Document, Options ) 
		{
			let results = await Storage.MemoryStorage.InsertOne( Document, Options );
			if ( Storage.MemoryStorage.is_dirty )
			{
				if ( Settings.AutoFlush ) { write_storage(); }
				Storage.MemoryStorage.is_dirty = false;
			}
			return results;
		};


		//=====================================================================
		// InsertMany
		//=====================================================================


		Storage.InsertMany = async function ( Documents, Options ) 
		{
			let results = await Storage.MemoryStorage.InsertMany( Documents, Options );
			if ( Storage.MemoryStorage.is_dirty )
			{
				if ( Settings.AutoFlush ) { write_storage(); }
				Storage.MemoryStorage.is_dirty = false;
			}
			return results;
		};


		//=====================================================================
		// FindOne
		//=====================================================================


		Storage.FindOne = async function FindOne( Criteria, Projection, Options ) 
		{
			let results = await Storage.MemoryStorage.FindOne( Criteria, Projection, Options );
			return results;
		};


		//=====================================================================
		// FindMany
		//=====================================================================


		Storage.FindMany = async function FindMany( Criteria, Projection, Options ) 
		{
			let results = await Storage.MemoryStorage.FindMany( Criteria, Projection, Options );
			return results;
		};


		//=====================================================================
		// UpdateOne
		//=====================================================================


		Storage.UpdateOne = async function UpdateOne( Criteria, Update, Options ) 
		{
			let results = await Storage.MemoryStorage.UpdateOne( Criteria, Update, Options );
			if ( Storage.MemoryStorage.is_dirty )
			{
				if ( Settings.AutoFlush ) { write_storage(); }
				Storage.MemoryStorage.is_dirty = false;
			}
			return results;
		};


		//=====================================================================
		// UpdateMany
		//=====================================================================


		Storage.UpdateMany = async function UpdateMany( Criteria, Update, Options ) 
		{
			let results = await Storage.MemoryStorage.UpdateMany( Criteria, Update, Options );
			if ( Storage.MemoryStorage.is_dirty )
			{
				if ( Settings.AutoFlush ) { write_storage(); }
				Storage.MemoryStorage.is_dirty = false;
			}
			return results;
		};


		//=====================================================================
		// ReplaceOne
		//=====================================================================


		Storage.ReplaceOne = async function ReplaceOne( Criteria, Document, Options ) 
		{
			let results = await Storage.MemoryStorage.ReplaceOne( Criteria, Document, Options );
			if ( Storage.MemoryStorage.is_dirty )
			{
				if ( Settings.AutoFlush ) { write_storage(); }
				Storage.MemoryStorage.is_dirty = false;
			}
			return results;
		};


		//=====================================================================
		// DeleteOne
		//=====================================================================


		Storage.DeleteOne = async function DeleteOne( Criteria, Options ) 
		{
			let results = await Storage.MemoryStorage.DeleteOne( Criteria, Options );
			if ( Storage.MemoryStorage.is_dirty )
			{
				if ( Settings.AutoFlush ) { write_storage(); }
				Storage.MemoryStorage.is_dirty = false;
			}
			return results;
		};


		//=====================================================================
		// DeleteMany
		//=====================================================================


		Storage.DeleteMany = async function DeleteMany( Criteria, Options ) 
		{
			let results = await Storage.MemoryStorage.DeleteMany( Criteria, Options );
			if ( Storage.MemoryStorage.is_dirty )
			{
				if ( Settings.AutoFlush ) { write_storage(); }
				Storage.MemoryStorage.is_dirty = false;
			}
			return results;
		};


		//=====================================================================
		return Storage;
	},

};


