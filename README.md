# EcmaCat: ECMA/Javascript Catalog of Globals

> A human-friendly, machine-readable list of standard JavaScript globals with type information.

## Usage

### JSON

At the moment there isn't a package. But you can copy the `globals.json` file into your project until there is one.

### CLI

You can also clone the repository and run the CLI. It currently requires Deno but support for other runtimes will exist with the first published package.

Once you have the repository cloned, run:

```bash
deno run -A ./src/EcmaCat.ts PATHS
```

**PATHS** are any number of paths to Typescript files or Typescript definitions files.

To save the output to a file, run:

```bash
deno run -A ./src/EcmaCat.ts PATHS > mycode.json
```

## Types

The types are _interesting_ at the moment. They are currently written as s-expressions.

Type paramters are expressed within angle brackets attached to the expression they apply to. For example:

```clj
(list foo<string>)
```

There's a lot of work to do here. See Stability.

## Stability

The JSON format isn't stable yet. Especially type properties. Feedback is welcomed.

## Planned

- Support for Node
- NPM and JSR packages
- A binary CLI built with Deno and runnable on Linux, Mac, or Windows (via WSL)
- Extensible TypeParser (using the Visitor Pattern)
  - So you can format the serialized types however you want.

## Rationale

There are a few packages that appear to have this data, but are either incomplete or are not machine-readable. [mdn-data](https://github.com/mdn/data) only
defines inheritance; [mdn-content](https://github.com/mdn/content) and [js-core](https://github.com/zloirock/core-js) are comprehensive, but not machine
readable. However, all of this data is clearly encoded in TypeScript's lib files. This code uses the TypeScript API to parse the lib files and convert them into
a simplified JSON format. Honestly, this seems like it must have already been solved and as if this is completely over-engineering the whole thing. So if you
know of a better way, or some data that already exists, please leave an issue.

## References

- [TypeScript AST Viewer](https://ts-ast-viewer.com/)
- [ts-morph](https://ts-morph.com/details/interfaces)

## License

See [LICENSE](./LICENSE)
