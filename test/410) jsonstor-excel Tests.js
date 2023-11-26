'use strict';

const LIB_PATH = require( 'path' );

const JsonStorages = require( '../src/jsonstor' )();
const Storage = JsonStorages.GetStorage( 'jsonstor-excel', {
	Path: LIB_PATH.join( __dirname, '~temp', 'jsonstor-excel.xls' ),
	SheetName: 'unit-tests',
} );


describe( '410) jsonstor-excel Tests', () =>
{
	require( './storage-tests/A) CRUD Tests.js' )( Storage, 100 );
	require( './storage-tests/B) Rainbow Query Tests.js' )( Storage );
	require( './storage-tests/C) MongoDB Tutorial.js' )( Storage );
	require( './storage-tests/D) MongoDB Reference.js' )( Storage );
	require( './storage-tests/Z) Ad-Hoc Tests.js' )( Storage );
} );

