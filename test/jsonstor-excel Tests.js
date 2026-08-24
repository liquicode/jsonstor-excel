'use strict';

const LIB_PATH = require( 'path' );

const jsonstor = require( '@liquicode/jsonstor' )();
jsonstor.LoadPlugin( require( '../src/jsonstor-excel.js' ) );

const run_inventory = require( '@liquicode/jsonstor-docs' );

const Storage = jsonstor.GetStorage( 'jsonstor-excel', {
	Path: LIB_PATH.join( __dirname, '~temp', 'jsonstor-excel.xls' ),
	SheetName: 'unit-tests',
} );


describe( 'jsonstor-excel Tests', () =>
{
	run_inventory( Storage );
} );

