'use strict';

const LIB_PATH = require( 'path' );

const jsonstor = require( '@liquicode/jsonstor' )();
jsonstor.LoadPlugin( require( '../src/jsonstor-excel.js' ) );

const Storage = jsonstor.GetStorage( 'jsonstor-excel', {
	Path: LIB_PATH.join( __dirname, '~temp', 'jsonstor-excel.xls' ),
	SheetName: 'unit-tests',
} );


describe( 'jsonstor-excel Tests', () =>
{
	let jsonstor_tests_path = '../node_modules/@liquicode/jsonstor/test/Storage Tests';
	require( jsonstor_tests_path + '/A) CRUD Tests.js' )( Storage, 100 );
	require( jsonstor_tests_path + '/B) Rainbow Query Tests.js' )( Storage );
	require( jsonstor_tests_path + '/C) Userinfo Permissions Tests.js' )( Storage );
	require( jsonstor_tests_path + '/M) MongoDB Tutorial.js' )( Storage );
	require( jsonstor_tests_path + '/N) MongoDB Reference.js' )( Storage );
	require( jsonstor_tests_path + '/Z) Ad-Hoc Tests.js' )( Storage );
} );

