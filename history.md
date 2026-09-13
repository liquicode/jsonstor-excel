# jsonstor-excel
[`@liquicode/jsonstor-excel`](https://github.com/liquicode/jsonstor-excel)


# Project History


v0.2.0 (current)
---------------------------------------------------------------------

- Built on `@liquicode/jsonstor` 0.2.0 and `@liquicode/jsongin` 0.2.0. A criteria the engine
  refuses is refused before the storage acts on it.
- `FindMany2()` takes a `Paging` object, `{ SkipCount, MaxCount }`, as well as a number.
- `StorageInfo()` reports the adapter asked for, the dialect in force and the server version.
- `DropStorage` removes only its own worksheet, and deletes the workbook when that worksheet
  was the last one. *Was: removed every worksheet after the first.*
- The index is rebuilt whenever the workbook is read.
- Declares Node.js `>=10.4.0` in `engines`.


v0.1.0 (2026-08-31)
---------------------------------------------------------------------

- Built on `@liquicode/jsonstor` 0.1.0 and `@liquicode/jsongin` 0.1.0.


v0.0.20 (2024-05-20)
---------------------------------------------------------------------

- Added function: FindMany2( Criteria, Projection, Sort, MaxCount, Options )
- Updated npm library `@liquicode/jsonstor` to `v0.0.20`.
- Updated npm library `@liquicode/jsongin` to `v0.0.20`.


v0.0.1 (2023-12-05)
---------------------------------------------------------------------

- Initial release.
