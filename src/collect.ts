// The goal of this script is to collect all of the built-in objects, properties, methods,
// and events from the TypeScript declaration files and ouput them in a SIMPLE format.
// To that end, unparsed type information is included, but the parsed types are simplified
// to the closest primitive.
//
// NOTE: Use only _for_ loops instead of spread operators. Spreading values from a large
// array (e.g. `b.push(...oneBillionValues)`) will cause a stack overflow due to the size
// of the files being parsed. To keep things simple, _for_ loops are also used instead of
// maps, flatMaps, and reducers. Don't try to "fix" this with functional style methods.
//
// TODO: Combine root and nonroot parsing functions into a single function
// TODO: Include type information as a string (untouched)
// TODO: Reduce parsed types to their most basic primitive form
// TODO: Move data back into the ast class to make minification easier
// TODO: Minify ASTs by removing unneccesary properties
// TODO: Convert back to plain typescript compiler instead of ts-morph

import * as tsMorph from "ts-morph";
import * as assertions from "./assertions.ts";
import * as types from "./types.ts";
import { jsInterfaces } from "../data/interfaces.ts";

export class Collector {
  private sourceFiles: tsMorph.SourceFile[];
  private idCounter = 0;
  private variableNames: Set<string> = jsInterfaces;
  private variableTypeToNameMap: Map<string, string> = new Map();
  private variableNameToTypeMap: Map<string, string> = new Map();
  private interfaceNameToAccess: Map<string, "static" | "instance"> = new Map();
  private debugEnabled = false;

  public constructor(private project: tsMorph.Project, paths: string[]) {
    assertions.assertProject(project);
    assertions.assertPaths(paths);

    this.project.addSourceFilesAtPaths(paths);
    this.sourceFiles = this.project.getSourceFiles();
  }

  public collectGlobals(): Record<string, types.Ast[]> {
    const groupedAsts: Record<string, types.Ast[]> = {};
    this.findAllVariableNames();

    const builtins = this.parseRootDeclarations();

    for (const builtin of builtins) {
      try {
        if (builtin.name === "toString") {
          builtin.name = "globalThis.toString";
        }

        if (builtin.name === "__EMPTY__") {
          continue;
        }

        if (builtin.children.length) {
          for (const child of builtin.children) {
            if (!groupedAsts[builtin.name]) {
              groupedAsts[builtin.name] = [];
            }
            groupedAsts[builtin.name].push(child);
          }
          builtin.children = [];
        }
        if (!groupedAsts[builtin.name]) {
          groupedAsts[builtin.name] = [];
        }
        groupedAsts[builtin.name].push(builtin);
      } catch (error) {
        console.error(`Error processing builtin: ${builtin.name}`, error);
      }
    }
    return groupedAsts;
  }

  private findAllVariableNames() {
    for (const file of this.sourceFiles) {
      for (const declaration of file.getVariableDeclarations()) {
        const variableName = declaration.getName();
        const variableTypeName = declaration.getTypeNode()?.getText();
        if (variableTypeName) {
          this.variableTypeToNameMap.set(variableTypeName, variableName);
          this.variableNameToTypeMap.set(variableName, variableTypeName);

          if (variableName === variableTypeName) {
            this.interfaceNameToAccess.set(variableName, "static");
          } else {
            this.interfaceNameToAccess.set(variableName, "instance");
            this.interfaceNameToAccess.set(variableTypeName, "static");
          }
        }
      }
      for (const moduleDeclaration of file.getModules()) {
        for (const variableDeclaration of moduleDeclaration.getVariableDeclarations()) {
          const variableName = variableDeclaration.getName();
          const variableTypeName = variableDeclaration.getTypeNode()?.getText();
          if (variableTypeName) {
            this.variableTypeToNameMap.set(variableTypeName, variableName);
            this.variableNameToTypeMap.set(variableName, variableTypeName);

            if (variableTypeName) {
              this.variableTypeToNameMap.set(variableTypeName, variableName);
              this.variableNameToTypeMap.set(variableName, variableTypeName);
              if (variableName === variableTypeName) {
                this.interfaceNameToAccess.set(variableName, "static");
              } else {
                this.interfaceNameToAccess.set(variableName, "instance");
                this.interfaceNameToAccess.set(variableTypeName, "static");
              }
            }
          }
        }
      }
    }
  }

  // TODO: Add an assertion once Ast is using the Ast class
  private createEmptyAst(children: types.Ast[] = []): types.Ast {
    return this.createAst("__EMPTY__", "__EMPTY__", {
      children,
    });
  }

  private parseRootDeclarations(): types.Ast[] {
    const builtins: types.Ast[] = [];
    const previouslyParsed: Set<types.DeclarationTypes> = new Set();

    for (const file of this.sourceFiles) {
      for (const declaration of file.getVariableDeclarations()) {
        if (previouslyParsed.has(declaration)) continue;
        const parsed = this.parseRootVariable(declaration);
        builtins.push(parsed);
        previouslyParsed.add(declaration);
      }

      for (const interfaceDeclaration of file.getInterfaces()) {
        if (previouslyParsed.has(interfaceDeclaration)) continue;
        this.debug(`Parsing ROOT interface: ${interfaceDeclaration.getName()} in file ${file.getFilePath()}`);
        const interfaceAst = this.parseRootInterface(interfaceDeclaration);
        builtins.push(interfaceAst);
        previouslyParsed.add(interfaceDeclaration);
      }

      for (const functionDeclaration of file.getFunctions()) {
        if (previouslyParsed.has(functionDeclaration)) continue;
        this.debug(`Parsing ROOT function: ${functionDeclaration.getName()} in file ${file.getFilePath()}`);
        const functionAst = this.parseRootFunction(functionDeclaration);
        builtins.push(functionAst);
        previouslyParsed.add(functionDeclaration);
      }

      for (const moduleDeclaration of file.getModules()) {
        if (previouslyParsed.has(moduleDeclaration)) continue;
        this.debug(`Parsing ROOT module: ${moduleDeclaration.getName()} in file ${file.getFilePath()}`);
        const moduleAst = this.parseRootModule(moduleDeclaration);
        builtins.push(moduleAst);
        previouslyParsed.add(moduleDeclaration);
      }

      for (const classDeclaration of file.getClasses()) {
        this.debug(`Parsing ROOT class: ${classDeclaration.getName()} in file ${file.getFilePath()}`);
        if (previouslyParsed.has(classDeclaration)) continue;
        const classAst = this.parseRootClass(classDeclaration);
        builtins.push(classAst);
        previouslyParsed.add(classDeclaration);
      }
    }
    return builtins;
  }

  private parseRootVariable(variableDeclaration: tsMorph.VariableDeclaration): types.Ast {
    assertions.assertVariableDeclaration(variableDeclaration);

    const nameNode = variableDeclaration.getNameNode();
    const typeNode = variableDeclaration.getTypeNode();

    if (typeNode === undefined || tsMorph.ts.isTokenKind(typeNode.getKind())) {
      return this.parseBasicRootVariable(nameNode, typeNode);
    }

    const variableName = nameNode.getText();
    return this.createAst(variableName, variableDeclaration.getKindName(), {
      returns: typeNode ? [this.resolveType(typeNode)] : [],
    });
  }

  private parseBasicRootVariable(nameNode: tsMorph.BindingName, typeNode: tsMorph.TypeNode | undefined) {
    assertions.assertBindingName(nameNode);
    assertions.assertNode(typeNode);
    this.debug(`Parsinng basic root variable: ${nameNode.getText()} with type ${typeNode?.getText()}`);

    return this.createAst(nameNode.getText(), "VariableDeclaration", {
      returns: [typeNode ? this.resolveType(typeNode) : this.createUndefinedKeywordAst()],
    });
  }

  private parseRootFunction(declaration: tsMorph.FunctionDeclaration): types.Ast {
    assertions.assertFunctionDeclarationType(declaration);

    const name = declaration.getName() ?? this.getNextId();
    this.debug(`parsing ROOT function ${name}`);
    return this.createAst(name, declaration.getKindName(), {
      params: this.parseParameters(declaration.getParameters()),
      returns: this.collectReturns(declaration),
      generics: this.collectGenerics(declaration),
    });
  }

  private parseRootClass(classDeclaration: tsMorph.ClassDeclaration): types.Ast {
    assertions.assertClassType(classDeclaration);

    const nameNode = classDeclaration.getNameNode();
    if (!nameNode) return this.createEmptyAst(); // Classes can be anonymous, but top-level classes should always have a name.

    const className = nameNode.getText();
    const extendsExpression = classDeclaration.getExtends();
    const extendsName = extendsExpression ? [extendsExpression.getText()] : [];

    const builtin = this.createAst(className, classDeclaration.getKindName(), { extends: extendsName });

    const ancestry = new Set<string>();
    ancestry.add(className);

    for (const constructorDeclaration of classDeclaration.getConstructors()) {
      const parsed = this.parseConstructorDeclaration(constructorDeclaration, ancestry);
      builtin.children.push(parsed);
    }

    for (const typeParameter of classDeclaration.getTypeParameters()) {
      builtin.generics.push(this.handleTypeParameter(typeParameter));
    }

    const properties = classDeclaration.getProperties();
    const propertyAsts: types.Ast[] = [];

    for (const property of properties) {
      if (!property.isStatic()) ancestry.add("prototype");

      const typeNode = property.getTypeNode();
      const propertyName = this.formatName(property.getName(), ancestry);
      const propertyAst = this.createAst(propertyName, property.getKindName(), {
        returns: typeNode ? [this.resolveType(typeNode)] : [],
      });

      propertyAsts.push(propertyAst);
    }

    const methods = classDeclaration.getMethods();
    const methodAsts: types.Ast[] = [];
    for (const method of methods) {
      if (!method.isStatic()) ancestry.add("prototype");

      const methodName = this.formatName(method.getName(), ancestry);
      const methodAst = this.createAst(methodName, method.getKindName(), {
        params: this.parseParameters(method.getParameters()),
        returns: this.collectReturns(method),
        generics: this.collectGenerics(method),
      });

      methodAsts.push(methodAst);
    }

    return builtin;
  }

  private parseRootModule(moduleDeclaration: tsMorph.ModuleDeclaration): types.Ast {
    assertions.assertModuleType(moduleDeclaration);

    const previouslyParsed: Set<types.DeclarationTypes> = new Set();
    const ast = this.createAst(moduleDeclaration.getName(), moduleDeclaration.getKindName(), {});
    const ancestry = new Set<string>([moduleDeclaration.getName()]);

    for (const declaration of moduleDeclaration.getVariableDeclarations()) {
      if (previouslyParsed.has(declaration)) continue;
      const parsed = this.parseVariableDeclaration(declaration, ancestry);
      ast.children.push(parsed);
      previouslyParsed.add(declaration);
    }

    for (const declaration of moduleDeclaration.getFunctions()) {
      if (previouslyParsed.has(declaration)) continue;
      const parsed = this.parseFunction(declaration, ancestry);
      ast.children.push(parsed);
      previouslyParsed.add(declaration);
    }

    for (const declaration of moduleDeclaration.getModules()) {
      if (previouslyParsed.has(declaration)) continue;
      const parsed = this.parseModule(declaration, ancestry);
      ast.children.push(parsed);
      previouslyParsed.add(declaration);
    }

    for (const declaration of moduleDeclaration.getClasses()) {
      if (previouslyParsed.has(declaration)) continue;
      const parsed = this.parseClass(declaration, ancestry);
      ast.children.push(parsed);
      previouslyParsed.add(declaration);
    }

    return ast;
  }

  private parseRootInterface(interfaceDeclaration: tsMorph.InterfaceDeclaration): types.Ast {
    assertions.assertInterfaceDeclaration(interfaceDeclaration);

    const realInterfaceName = interfaceDeclaration.getName();
    let effectiveInterfaceName = "";
    if (this.variableNames.has(realInterfaceName)) {
      effectiveInterfaceName = realInterfaceName;
    } else if (this.variableTypeToNameMap.has(realInterfaceName)) {
      effectiveInterfaceName = this.variableTypeToNameMap.get(interfaceDeclaration.getName())!;
    }

    if (!effectiveInterfaceName) return this.createEmptyAst();

    const builtin = this.createAst(effectiveInterfaceName, interfaceDeclaration.getKindName(), {});
    const ancestry = new Set<string>([effectiveInterfaceName]);

    const constructSignatureDeclarations = interfaceDeclaration.getConstructSignatures();
    const constructSignatureAsts = this.parseConstructSignatures(constructSignatureDeclarations, ancestry);
    for (const constructSignatureAst of constructSignatureAsts) {
      builtin.children.push(constructSignatureAst);
    }

    const callSignatureDeclarations = interfaceDeclaration.getCallSignatures();
    const callSignatureAsts = this.parseCallSignatures(callSignatureDeclarations, ancestry);
    for (const callSignatureAst of callSignatureAsts) {
      builtin.children.push(callSignatureAst);
    }

    if (this.interfaceNameToAccess.get(realInterfaceName) === "instance") {
      ancestry.add("prototype");
    }

    const properties = interfaceDeclaration.getProperties();
    for (const property of properties) {
      const typeNode = property.getTypeNode();
      const propertyName = this.formatName(property.getName(), ancestry);
      const propertyAst = this.createAst(propertyName, property.getKindName(), {
        returns: typeNode ? [this.resolveType(typeNode)] : [],
      });

      builtin.children.push(propertyAst);
    }

    const methods = interfaceDeclaration.getMethods();
    for (const method of methods) {
      const methodName = this.formatName(method.getName(), ancestry);
      const methodAst = this.createAst(methodName, method.getKindName(), {
        params: this.parseParameters(method.getParameters()),
        returns: this.collectReturns(method),
        generics: this.collectGenerics(method),
      });

      builtin.children.push(methodAst);
    }

    return builtin;
  }

  private parseVariableDeclaration(variableDeclaration: tsMorph.VariableDeclaration, ancestry: Set<string>): types.Ast {
    const nameNode = variableDeclaration.getNameNode();

    const typeNode = variableDeclaration.getTypeNode();
    if (typeNode === undefined || tsMorph.ts.isTokenKind(typeNode.getKind())) {
      return this.parseBasicVariable(nameNode, typeNode, ancestry);
    }

    const variableName = this.formatName(nameNode.getText(), ancestry);
    return this.createAst(variableName, variableDeclaration.getKindName(), {
      returns: typeNode ? [this.resolveType(typeNode)] : [],
    });
  }

  private parseBasicVariable(variableNameNode: tsMorph.BindingName, variableTypeNode: tsMorph.TypeNode | undefined, ancestry: Set<string>) {
    assertions.assertBindingName(variableNameNode);
    assertions.assertTypeNodeOrUndefined(variableTypeNode);
    assertions.assertAncestry(ancestry);

    const fullyQualifiedVariableName = this.formatName(variableNameNode.getText(), ancestry);
    return this.createAst(fullyQualifiedVariableName, "VariableDeclaration", {
      returns: [variableTypeNode ? this.resolveType(variableTypeNode) : this.createUndefinedKeywordAst()],
    });
  }

  private parseInterface(interfaceDeclaration: tsMorph.InterfaceDeclaration, ancestry: Set<string>): types.Ast[] {
    assertions.assertInterfaceDeclaration(interfaceDeclaration);

    const realInterfaceName = interfaceDeclaration.getName();
    let effectiveInterfaceName = "";
    if (this.variableNames.has(realInterfaceName)) {
      effectiveInterfaceName = realInterfaceName;
    } else if (this.variableTypeToNameMap.has(realInterfaceName)) {
      effectiveInterfaceName = this.variableTypeToNameMap.get(interfaceDeclaration.getName())!;
    }

    if (!effectiveInterfaceName) return [];

    const interfaceAsts: types.Ast[] = [];
    ancestry.add(effectiveInterfaceName);

    const constructSignatures = interfaceDeclaration.getConstructSignatures();
    const parsedConstructSignatures = this.parseConstructSignatures(constructSignatures, ancestry);
    for (const constructSignature of parsedConstructSignatures) {
      interfaceAsts.push(constructSignature);
    }

    const callSignatures = interfaceDeclaration.getCallSignatures();
    const parsedCallSignatures = this.parseCallSignatures(callSignatures, ancestry);
    for (const callSignature of parsedCallSignatures) {
      interfaceAsts.push(callSignature);
    }

    if (this.interfaceNameToAccess.get(realInterfaceName) === "instance") {
      ancestry.add("prototype");
    }

    const properties = interfaceDeclaration.getProperties();
    for (const property of properties) {
      const typeNode = property.getTypeNode();
      const propertyName = this.formatName(property.getName(), ancestry);
      const propertyAst = this.createAst(propertyName, property.getKindName(), {
        returns: typeNode ? [this.resolveType(typeNode)] : [],
      });

      interfaceAsts.push(propertyAst);
    }

    const methods = interfaceDeclaration.getMethods();
    for (const method of methods) {
      const methodName = this.formatName(method.getName(), ancestry);
      const methodAst = this.createAst(methodName, method.getKindName(), {
        params: this.parseParameters(method.getParameters()),
        returns: this.collectReturns(method),
        generics: this.collectGenerics(method),
      });

      interfaceAsts.push(methodAst);
    }

    return interfaceAsts;
  }

  private parseFunction(functionDeclaration: tsMorph.FunctionDeclaration, ancestry: Set<string>): types.Ast {
    assertions.assertFunctionDeclarationType(functionDeclaration);
    assertions.assertAncestry(ancestry);

    const functionName = functionDeclaration.getName() ?? this.getNextId();
    const fullyQualifiedFunctionName = this.formatName(functionName, ancestry);
    this.debug(`Parsinging function ${functionName} - with ancestry: ${fullyQualifiedFunctionName}`);

    return this.createAst(fullyQualifiedFunctionName, functionDeclaration.getKindName(), {
      params: this.parseParameters(functionDeclaration.getParameters()),
      returns: this.collectReturns(functionDeclaration),
      generics: this.collectGenerics(functionDeclaration),
    });
  }

  private parseClass(classDeclaration: tsMorph.ClassDeclaration, ancestry: Set<string>): types.Ast {
    assertions.assertClassType(classDeclaration);
    assertions.assertAncestry(ancestry);

    const classNameNode = classDeclaration.getNameNode();
    if (!classNameNode) return this.createEmptyAst(); // Classes can be anonymous, but top-level classes should always have a name.

    const extendsExpression = classDeclaration.getExtends();
    const extendsName = extendsExpression ? [extendsExpression.getText()] : [];

    const className = classNameNode.getText();
    const fullyQualifiedClassName = this.formatName(className, ancestry);
    const builtin = this.createAst(fullyQualifiedClassName, classDeclaration.getKindName(), { extends: extendsName });

    ancestry.add(className);

    for (const constructorDeclaration of classDeclaration.getConstructors()) {
      const parsedConstructorDeclaration = this.parseConstructorDeclaration(constructorDeclaration, ancestry);
      builtin.children.push(parsedConstructorDeclaration);
    }

    for (const typeParameter of classDeclaration.getTypeParameters()) {
      builtin.generics.push(this.handleTypeParameter(typeParameter));
    }

    const properties = classDeclaration.getProperties();
    for (const property of properties) {
      if (!property.isStatic()) ancestry.add("prototype");

      const typeNode = property.getTypeNode();
      const propertyName = this.formatName(property.getName(), ancestry);
      const propertyAst = this.createAst(propertyName, property.getKindName(), {
        returns: typeNode ? [this.resolveType(typeNode)] : [],
      });

      builtin.children.push(propertyAst);
    }

    const methods = classDeclaration.getMethods();
    const methodAsts: types.Ast[] = [];
    for (const method of methods) {
      if (!method.isStatic()) ancestry.add("prototype");

      const methodName = this.formatName(method.getName(), ancestry);
      const methodAst = this.createAst(methodName, method.getKindName(), {
        params: this.parseParameters(method.getParameters()),
        returns: this.collectReturns(method),
        generics: this.collectGenerics(method),
      });

      methodAsts.push(methodAst);
    }

    return builtin;
  }

  private parseModule(moduleDeclaration: tsMorph.ModuleDeclaration, ancestry: Set<string>): types.Ast {
    assertions.assertModuleType(moduleDeclaration);
    assertions.assertAncestry(ancestry);

    const previouslyParsedDeclarations: Set<types.DeclarationTypes> = new Set();
    const moduleName = moduleDeclaration.getName();
    const fullyQualifiedModuleName = this.formatName(moduleName, ancestry);
    const ast = this.createAst(fullyQualifiedModuleName, moduleDeclaration.getKindName(), {});

    ancestry.add(moduleDeclaration.getName());
    for (const variableDeclaration of moduleDeclaration.getVariableDeclarations()) {
      if (previouslyParsedDeclarations.has(variableDeclaration)) continue;
      const interfaceAsts = this.parseVariableDeclaration(variableDeclaration, ancestry);
      ast.children.push(interfaceAsts);
      previouslyParsedDeclarations.add(variableDeclaration);
    }

    for (const declaration of moduleDeclaration.getInterfaces()) {
      if (previouslyParsedDeclarations.has(declaration)) continue;
      const members = this.parseInterface(declaration, ancestry);
      for (const member of members) {
        ast.children.push(member);
      }
      previouslyParsedDeclarations.add(declaration);
    }

    for (const functionDeclaration of moduleDeclaration.getFunctions()) {
      if (previouslyParsedDeclarations.has(functionDeclaration)) continue;
      const functionAst = this.parseFunction(functionDeclaration, ancestry);
      ast.children.push(functionAst);
      previouslyParsedDeclarations.add(functionDeclaration);
    }

    for (const nestedModuleDeclaration of moduleDeclaration.getModules()) {
      if (previouslyParsedDeclarations.has(nestedModuleDeclaration)) continue;
      const moduleAst = this.parseModule(nestedModuleDeclaration, ancestry);
      ast.children.push(moduleAst);
      previouslyParsedDeclarations.add(nestedModuleDeclaration);
    }

    // There aren't any classes in tslib modules
    return ast;
  }

  private parseConstructSignatures(constructSignatures: tsMorph.ConstructSignatureDeclaration[], ancestry: Set<string>): types.Ast[] {
    assertions.assertConstructSignatures(constructSignatures);
    assertions.assertAncestry(ancestry);

    const astArray: types.Ast[] = [];
    for (const constructSignature of constructSignatures) {
      const ast = this.parseConstructSignature(constructSignature, ancestry);
      astArray.push(ast);
    }
    return astArray;
  }

  private parseConstructSignature(constructSignature: tsMorph.ConstructSignatureDeclaration, ancestry: Set<string>): types.Ast {
    assertions.assertAncestry(ancestry);

    const name = this.formatName("new", ancestry);
    return this.createAst(name, constructSignature.getKindName(), {
      params: this.parseParameters(constructSignature.getParameters()),
      returns: this.collectReturns(constructSignature),
      generics: this.collectGenerics(constructSignature),
    });
  }

  private parseCallSignatures(callSignatures: tsMorph.CallSignatureDeclaration[], ancestry: Set<string>): types.Ast[] {
    assertions.assertCallSignatures(callSignatures);

    const astArray: types.Ast[] = [];
    for (const callSignature of callSignatures) {
      const ast = this.createAst(this.joinAncestry(ancestry), callSignature.getKindName(), {
        params: this.parseParameters(callSignature.getParameters()),
        returns: this.collectReturns(callSignature),
        generics: this.collectGenerics(callSignature),
      });
      astArray.push(ast);
    }
    return astArray;
  }

  private parseConstructorDeclaration(declaration: tsMorph.ConstructorDeclaration, ancestry: Set<string>): types.Ast {
    assertions.assertConstructorDeclaration(declaration);
    assertions.assertAncestry(ancestry);

    const fullyQualifiedClassName = this.formatName("new", ancestry);
    return this.createAst(fullyQualifiedClassName, declaration.getKindName(), {
      params: this.parseParameters(declaration.getParameters()),
      returns: this.collectReturns(declaration),
      generics: this.collectGenerics(declaration),
    });
  }

  private parseProperties(properties: (tsMorph.PropertySignature | tsMorph.PropertyDeclaration)[], ancestry: Set<string>): types.Ast[] {
    assertions.assertProperties(properties);
    assertions.assertAncestry(ancestry);

    const propertyAsts: types.Ast[] = [];
    for (const propertySignature of properties) {
      const propertyAst = this.parseProperty(propertySignature, ancestry);
      propertyAsts.push(propertyAst);
    }

    return propertyAsts;
  }

  private parseProperty(property: tsMorph.PropertyDeclaration | tsMorph.PropertySignature, ancestry: Set<string>) {
    const typeNode = property.getTypeNode();
    const formattedName = this.formatName(property.getName(), ancestry);
    const propertyAst = this.createAst(formattedName, property.getKindName(), {
      returns: typeNode ? [this.resolveType(typeNode)] : [],
    });

    return propertyAst;
  }

  private parseMethods(methods: (tsMorph.MethodSignature | tsMorph.MethodDeclaration)[], ancestry: Set<string>): types.Ast[] {
    assertions.assertMethods(methods);
    assertions.assertAncestry(ancestry);

    const astArray: types.Ast[] = [];
    for (const method of methods) {
      const parsedMethod = this.parseMethod(method, ancestry);
      astArray.push(parsedMethod);
    }

    return astArray;
  }

  // tsMorph.MethodSignature doesn't have modifiers
  private parseMethod(method: tsMorph.MethodDeclaration | tsMorph.MethodSignature, ancestry: Set<string>): types.Ast {
    assertions.assertFunctionType(method);
    assertions.assertAncestry(ancestry);

    let meta: string[] = [];
    if (method instanceof tsMorph.MethodSignature) {
      meta = this.getMeta(method);
      if (!meta.includes("static")) ancestry.add("prototype");
    }

    const methodName = this.formatName(method.getName(), ancestry);
    return this.createAst(methodName, method.getKindName(), {
      params: this.parseParameters(method.getParameters()),
      returns: this.collectReturns(method),
      generics: this.collectGenerics(method),
      meta,
    });
  }

  private parseParameters(parameters: tsMorph.ParameterDeclaration[]): types.Ast[] {
    assertions.assertParameters(parameters);

    const astArray: types.Ast[] = [];
    for (const parameter of parameters) {
      const parsedParameter = this.parseParameter(parameter);
      astArray.push(parsedParameter);
    }

    return astArray;
  }

  private parseParameter(parameter: tsMorph.ParameterDeclaration) {
    assertions.assertParameter(parameter);

    const typeNode = parameter.getTypeNode();
    return this.createAst(parameter.getName(), parameter.getKindName(), {
      returns: typeNode ? [this.resolveType(typeNode)] : [],
      meta: this.getMeta(parameter),
    });
  }

  private collectReturns(declaration: types.MemberTypes): types.Ast[] {
    assertions.assertMemberType(declaration);

    const node = declaration.getReturnTypeNode();
    return node ? [this.resolveType(node)] : [];
  }

  private collectGenerics(declaration: types.MemberTypes): types.Ast[] {
    assertions.assertMemberType(declaration);

    const astArray: types.Ast[] = [];

    const typeParameters = declaration.getTypeParameters();
    for (const typeParameter of typeParameters) {
      const parsedTypeParameter = this.handleTypeParameter(typeParameter);
      astArray.push(parsedTypeParameter);
    }

    return astArray;
  }

  private joinAncestry(ancestry: Set<string>): string {
    assertions.assertAncestry(ancestry);

    return Array.from(ancestry).join(".");
  }

  private formatName(name: string, ancestry: Set<string>) {
    assertions.assertName(name);
    assertions.assertAncestry(ancestry);

    const prefix = this.joinAncestry(ancestry);
    return this.isSymbol(name) ? `${prefix}${name}` : ancestry.size ? `${prefix}.${name}` : name;
  }

  private isSymbol(name: string) {
    return name.startsWith("[") && name.endsWith("]");
  }

  private getAstDefaults() {
    return {
      id: "",
      kind: "Unknown",
      name: "",
      generics: [],
      meta: [],
      params: [],
      returns: [],
      text: null,
      children: [],
      extends: [],
    };
  }

  private createAst(id: string, kind: string, ast: Omit<Partial<types.Ast>, "id" | "name" | "kind"> = {}): types.Ast {
    assertions.assertName(id);
    assertions.assertName(kind);
    assertions.assertAst(ast);

    return Object.assign({}, this.getAstDefaults(), ast, { id, kind, name: id });
  }

  private getMeta(param: tsMorph.Node): string[] {
    const meta: string[] = [];

    if (tsMorph.Node.isModifierable(param)) {
      const modifiers = param.getModifiers();
      for (const modifier of modifiers) {
        meta.push(modifier.getText());
      }
    }

    if (param instanceof tsMorph.ParameterDeclaration) {
      if (param.isOptional()) meta.push("optional");
      if (param.isRestParameter()) meta.push("rest");
    }

    return meta;
  }

  public resolveType(node: tsMorph.Node): types.Ast {
    assertions.assertNode(node);

    switch (node.getKind()) {
      case tsMorph.SyntaxKind.ArrayType:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.ArrayType, this.handleArrayType);
      case tsMorph.SyntaxKind.ConditionalType:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.ConditionalType, this.handleConditionalType);
      case tsMorph.SyntaxKind.ConstructorType:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.ConstructorType, this.handleConstructorType);
      case tsMorph.SyntaxKind.ExpressionWithTypeArguments:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.ExpressionWithTypeArguments, this.handleExpressionWithTypeArguments);
      case tsMorph.SyntaxKind.FunctionType:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.FunctionType, this.handleFunctionType);
      case tsMorph.SyntaxKind.Identifier:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.Identifier, this.handleIdentifier);
      case tsMorph.SyntaxKind.IndexSignature:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.IndexSignature, this.handleIndexSignature);
      case tsMorph.SyntaxKind.IndexedAccessType:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.IndexedAccessType, this.handleIndexedAccessType);
      case tsMorph.SyntaxKind.IntersectionType:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.IntersectionType, this.handleIntersectionType);
      case tsMorph.SyntaxKind.LiteralType:
      case tsMorph.SyntaxKind.StringLiteral:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.LiteralType, this.handleLiteralType);
      case tsMorph.SyntaxKind.MappedType:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.MappedType, this.handleMappedType);
      case tsMorph.SyntaxKind.MethodSignature:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.MethodSignature, this.handleMethodSignature);
      case tsMorph.SyntaxKind.Parameter:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.Parameter, this.parseParameter);
      case tsMorph.SyntaxKind.ParenthesizedType:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.ParenthesizedType, this.handleParenthesizedType);
      case tsMorph.SyntaxKind.PropertySignature:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.PropertySignature, this.handlePropertySignature);
      case tsMorph.SyntaxKind.RestType:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.RestType, this.handleRestType);
      case tsMorph.SyntaxKind.TemplateLiteralType:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.TemplateLiteralType, this.handleTemplateLiteralType);
      case tsMorph.SyntaxKind.ThisType:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.ThisType, this.handleThisType);
      case tsMorph.SyntaxKind.TupleType:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.TupleType, this.handleTupleType);
      case tsMorph.SyntaxKind.TypeLiteral:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.TypeLiteral, this.handleTypeLiteral);
      case tsMorph.SyntaxKind.TypeOperator:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.TypeOperator, this.handleTypeOperator);
      case tsMorph.SyntaxKind.TypeParameter:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.TypeParameter, this.handleTypeParameter);
      case tsMorph.SyntaxKind.TypePredicate:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.TypePredicate, this.handleTypePredicate);
      case tsMorph.SyntaxKind.TypeQuery:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.TypeQuery, this.handleTypeQuery);
      case tsMorph.SyntaxKind.TypeReference:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.TypeReference, this.handleTypeReference);
      case tsMorph.SyntaxKind.UnionType:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.UnionType, this.handleUnionType);
      default: {
        if (tsMorph.ts.isToken(node.compilerNode)) {
          return this.parseToken(node.compilerNode as tsMorph.ts.Token<tsMorph.ts.TokenSyntaxKind>);
        }

        return this.handleDefault(node);
      }
    }
  }

  private handleNodeOrDefault<T extends tsMorph.Node>(node: tsMorph.Node, kind: tsMorph.SyntaxKind, handler: (node: T) => types.Ast): types.Ast {
    assertions.assertNode(node);
    assertions.assertKind(kind);
    assertions.assertHandler(handler);

    const nodeOfKind = node.asKind(kind);
    return nodeOfKind ? handler.bind(this)(nodeOfKind as T) : this.handleDefault(node);
  }

  private parseToken(tokenNode: tsMorph.ts.Token<tsMorph.ts.TokenSyntaxKind>): types.Ast {
    assertions.assertToken(tokenNode);
    return this.createAst(this.getNextId(), tsMorph.ts.SyntaxKind[tokenNode.kind], {
      text: tokenNode.getText(),
    });
  }

  private handleUnionType(node: tsMorph.UnionTypeNode): types.Ast {
    assertions.assertUnionTypeNode(node);

    const ast = this.createAst(this.getNextId(), node.getKindName(), {});

    const typeNodes = node.getTypeNodes();
    for (const typeNode of typeNodes) {
      const resolvedType = this.resolveType(typeNode);

      if (Array.isArray(resolvedType)) {
        for (const item of resolvedType) {
          ast.returns.push(item);
        }
      } else {
        ast.returns.push(resolvedType);
      }
    }

    return ast;
  }

  private handleArrayType(node: tsMorph.ArrayTypeNode): types.Ast {
    assertions.assertArrayTypeNode(node);

    return this.createAst(this.getNextId(), node.getKindName(), {
      returns: [this.resolveType(node.getElementTypeNode())],
    });
  }

  private handleTypeReference(node: tsMorph.TypeReferenceNode): types.Ast {
    assertions.assertTypeReferenceNode(node);

    return this.createAst(node.getTypeName().getText(), node.getKindName(), {
      returns: node.getTypeArguments().map((t) => this.resolveType(t)),
    });
  }

  private handleIdentifier(node: tsMorph.Identifier): types.Ast {
    assertions.assertIdentifierNode(node);

    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.getText(),
    });
  }

  private handleLiteralType(node: tsMorph.LiteralTypeNode): types.Ast {
    assertions.assertLiteralTypeNode(node);

    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.getText(),
    });
  }

  private handleFunctionType(node: tsMorph.FunctionTypeNode): types.Ast {
    assertions.assertFunctionTypeNode(node);

    const returnTypeNode = node.getReturnTypeNode();

    const ast = this.createAst(this.getNextId(), node.getKindName(), {
      returns: returnTypeNode ? [this.resolveType(returnTypeNode)] : [],
    });

    const parameters = node.getParameters();
    for (const parameter of parameters) {
      ast.params.push(this.getParameter(parameter));
    }

    const typeParameters = node.getTypeParameters();
    for (const typeParameter of typeParameters) {
      ast.generics.push(this.handleTypeParameter(typeParameter));
    }

    return ast;
  }

  private handleTypeLiteral(node: tsMorph.TypeLiteralNode): types.Ast {
    assertions.assertTypeLiteralNode(node);

    const ast = this.createAst(this.getNextId(), node.getKindName(), {});

    const typeMembers = node.getMembers();
    for (const member of typeMembers) {
      ast.returns.push(this.resolveMember(member));
    }

    return ast;
  }

  private resolveMember(node: tsMorph.TypeElementTypes): types.Ast {
    assertions.assertTypeElementTypes(node);

    switch (node.getKind()) {
      case tsMorph.SyntaxKind.PropertySignature:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.PropertySignature, this.handlePropertySignature);
      case tsMorph.SyntaxKind.MethodSignature:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.MethodSignature, this.handleMethodSignature);
      case tsMorph.SyntaxKind.IndexSignature:
        return this.handleNodeOrDefault(node, tsMorph.SyntaxKind.IndexSignature, this.handleIndexSignature);
      default:
        return this.handleDefault(node);
    }
  }

  private handleTypeParameter(typeParameter: tsMorph.TypeParameterDeclaration): types.Ast {
    assertions.assertTypeParameter(typeParameter);

    const constraint = typeParameter.getConstraint();
    const defaultType = typeParameter.getDefault();

    const modifiers: string[] = [];
    const typeModifiers = typeParameter.getModifiers();
    for (const modifier of typeModifiers) {
      modifiers.push(modifier.getText());
    }

    return this.createAst(
      typeParameter.getName(),
      typeParameter.getKindName(),
      constraint
        ? {
          meta: modifiers,
          text: typeParameter.getText(),
          returns: defaultType ? [this.resolveType(defaultType)] : [],
          generics: constraint ? [this.resolveType(constraint)] : [],
        }
        : {},
    );
  }

  private handleIntersectionType(node: tsMorph.IntersectionTypeNode): types.Ast {
    assertions.assertIntersectionTypeNode(node);

    const resolvedTypes: types.Ast[] = [];

    const typeNodes = node.getTypeNodes();
    for (const typeNode of typeNodes) {
      const resolvedType = this.resolveType(typeNode);

      if (Array.isArray(resolvedType)) {
        for (const item of resolvedType) {
          resolvedTypes.push(item);
        }
      } else {
        resolvedTypes.push(resolvedType);
      }
    }

    return this.createAst(this.getNextId(), node.getKindName(), {
      returns: resolvedTypes,
    });
  }

  private handleTypeOperator(node: tsMorph.TypeOperatorTypeNode): types.Ast {
    assertions.assertTypeOperatorTypeNode(node);

    const operator = tsMorph.ts.tokenToString(node.getOperator());
    return this.createAst(this.getNextId(), node.getKindName(), {
      returns: [this.resolveType(node.getTypeNode())],
      meta: operator ? [operator] : [],
    });
  }

  private handleTupleType(node: tsMorph.TupleTypeNode): types.Ast {
    assertions.assertTupleTypeNode(node);

    const resolvedElements: types.Ast[] = [];

    const elements = node.getElements();
    for (const element of elements) {
      const resolvedElement = this.resolveType(element);
      resolvedElements.push(resolvedElement);
    }

    return this.createAst(this.getNextId(), node.getKindName(), {
      returns: resolvedElements,
    });
  }

  private handleRestType(node: tsMorph.RestTypeNode): types.Ast {
    assertions.assertRestTypeNode(node);

    return this.createAst(this.getNextId(), node.getKindName(), {
      meta: ["rest"],
      returns: [this.resolveType(node.getTypeNode())],
    });
  }

  private handleParenthesizedType(node: tsMorph.ParenthesizedTypeNode): types.Ast {
    assertions.assertParenthesizedTypeNode(node);

    return this.createAst(node.getText(), node.getKindName(), {
      returns: [this.resolveType(node.getTypeNode())],
    });
  }

  private handleIndexSignature(node: tsMorph.IndexSignatureDeclaration): types.Ast {
    assertions.assertIndexSignatureNode(node);

    return this.createAst(node.getKeyName(), node.getKindName(), {
      returns: [this.resolveType(node.getKeyTypeNode())],
    });
  }

  private handlePropertySignature(node: tsMorph.PropertySignature): types.Ast {
    assertions.assertPropertySignatureNode(node);

    return this.createAst(node.getName(), node.getKindName(), {
      returns: node.getTypeNode() ? [this.resolveType(node.getTypeNode()!)] : [],
      meta: node.hasQuestionToken() ? ["optional"] : [],
    });
  }

  private handleMappedType(node: tsMorph.MappedTypeNode): types.Ast {
    assertions.assertMappedTypeNode(node);

    const ast = this.createAst(this.getNextId(), node.getKindName(), {
      params: node.getTypeParameter() ? [this.handleTypeParameter(node.getTypeParameter()!)] : [],
      returns: node.getTypeNode() ? [this.resolveType(node.getTypeNode()!)] : [],
      meta: [],
    });

    if (node.getQuestionToken()) ast.meta.push("optional");
    if (node.getReadonlyToken()) ast.meta.push("readonly");
    return ast;
  }

  private handleIndexedAccessType(node: tsMorph.IndexedAccessTypeNode): types.Ast {
    assertions.assertIndexedAccessTypeNode(node);

    return this.createAst(this.getNextId(), node.getKindName(), {
      params: [this.resolveType(node.getIndexTypeNode())],
      returns: [this.resolveType(node.getIndexTypeNode())],
    });
  }

  private handleMethodSignature(node: tsMorph.MethodSignature): types.Ast {
    assertions.assertMethodSignatureNode(node);

    const ast = this.createAst(node.getName(), node.getKindName(), {
      meta: node.hasQuestionToken() ? ["optional"] : [],
      returns: node.getReturnTypeNode() ? [this.resolveType(node.getReturnTypeNode()!)] : [],
    });

    const typeParameters = node.getTypeParameters();
    for (const typeParameter of typeParameters) {
      ast.generics.push(this.handleTypeParameter(typeParameter));
    }

    const parameters = node.getParameters();
    for (const parameter of parameters) {
      ast.params.push(this.getParameter(parameter));
    }

    return ast;
  }

  private handleExpressionWithTypeArguments(node: tsMorph.ExpressionWithTypeArguments): types.Ast {
    assertions.assertExpressionWithTypeArguments(node);

    return this.createAst(this.getNextId(), node.getKindName(), {
      generics: node.getTypeArguments().map((arg) => this.resolveType(arg)),
      returns: node.getExpression() ? [this.resolveExpression(node.getExpression())] : [],
    });
  }

  // MAYBE: Handle each type of expression, e.g. Identifier, PropertyAccessExpression, etc.
  private resolveExpression(node: tsMorph.LeftHandSideExpression): types.Ast {
    assertions.assertLeftHandSideExpression(node);

    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.getText(),
    });
  }

  private handleThisType(node: tsMorph.ThisTypeNode): types.Ast {
    assertions.assertThisTypeNode(node);

    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.getText(),
    });
  }

  private handleConstructorType(node: tsMorph.ConstructorTypeNode): types.Ast {
    assertions.assertConstructorTypeNode(node);

    return this.createAst(this.getNextId(), node.getKindName(), {
      params: node.getParameters().map((p) => this.getParameter(p)),
      returns: node.getReturnTypeNode() ? [this.resolveType(node.getReturnTypeNode()!)] : [],
    });
  }

  private handleTypePredicate(node: tsMorph.TypePredicateNode): types.Ast {
    assertions.assertTypePredicateNode(node);

    return this.createAst(node.getParameterNameNode().getText(), node.getKindName(), {
      returns: node.getTypeNode() ? [this.resolveType(node.getTypeNode()!)] : [],
      meta: node.hasAssertsModifier() ? [node.getAssertsModifier()!.getText()] : [],
    });
  }

  private handleTypeQuery(node: tsMorph.TypeQueryNode): types.Ast {
    assertions.assertTypeQueryNode(node);

    return this.createAst(node.getExprName().getText(), node.getKindName(), {});
  }

  private handleTemplateLiteralType(node: tsMorph.TemplateLiteralTypeNode): types.Ast {
    assertions.assertTemplateLiteralTypeNode(node);

    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.getText(),
    });
  }

  private handleConditionalType(node: tsMorph.ConditionalTypeNode): types.Ast {
    assertions.assertConditionalTypeNode(node);

    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.getText(),
      params: [
        this.resolveType(node.getCheckType()),
        this.resolveType(node.getExtendsType()),
        this.resolveType(node.getTrueType()),
        this.resolveType(node.getFalseType()),
      ],
    });
  }

  private getParameter(node: tsMorph.ParameterDeclaration): types.Ast {
    assertions.assertParameter(node);
    return this.parseParameter(node);
  }

  private handleDefault(node: tsMorph.Node): types.Ast {
    assertions.assertNode(node);

    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.isKind(tsMorph.SyntaxKind.Identifier) ? node.getText() : null,
    });
  }

  private createUndefinedKeywordAst() {
    return this.createAst(this.getNextId(), "UndefinedKeyword", {
      text: "undefined",
    });
  }

  private getNextId() {
    return `_${++this.idCounter}`;
  }

  // deno-lint-ignore no-explicit-any
  private debug(...args: any[]) {
    if (this.debugEnabled) {
      console.log(...args);
    }
  }
}

if (import.meta.main) {
  const project = new tsMorph.Project({
    compilerOptions: { noLib: true },
  });

  const col = new Collector(project, [
    "./tslib/decorators.txt",
    "./tslib/decorators.legacy.txt",
    "./tslib/dom.generated.txt",
    "./tslib/es2015.symbol.txt",
    "./tslib/es2015.iterable.txt",
    "./tslib/es5.txt",
    "./tslib/es2015.symbol.wellknown.txt",
    "./tslib/es2015.symbol.txt",
    "./tslib/es2015.reflect.txt",
    "./tslib/es2015.proxy.txt",
    "./tslib/es2015.promise.txt",
    "./tslib/es2015.iterable.txt",
    "./tslib/es2015.generator.txt",
    "./tslib/es2015.core.txt",
    "./tslib/es2015.collection.txt",
    "./tslib/es2015.txt",
    "./tslib/es2016.array.include.txt",
    "./tslib/es2016.intl.txt",
    "./tslib/es2015.iterable.txt",
    "./tslib/es2016.txt",
    "./tslib/es2017.arraybuffer.txt",
    "./tslib/es2017.date.txt",
    "./tslib/es2017.intl.txt",
    "./tslib/es2017.object.txt",
    "./tslib/es2017.sharedmemory.txt",
    "./tslib/es2017.string.txt",
    "./tslib/es2017.typedarrays.txt",
    "./tslib/es2017.txt",
    "./tslib/es2018.asyncgenerator.txt",
    "./tslib/es2018.asynciterable.generated.txt",
    "./tslib/es2018.intl.txt",
    "./tslib/es2018.promise.txt",
    "./tslib/es2018.regexp.txt",
    "./tslib/es2018.txt",
    "./tslib/es2019.array.txt",
    "./tslib/es2019.intl.txt",
    "./tslib/es2019.object.txt",
    "./tslib/es2019.string.txt",
    "./tslib/es2019.symbol.txt",
    "./tslib/es2019.txt",
    "./tslib/es2020.bigint.txt",
    "./tslib/es2020.intl.txt",
    "./tslib/es2020.symbol.wellknown.txt",
    "./tslib/es2020.date.txt",
    "./tslib/es2020.number.txt",
    "./tslib/es2020.promise.txt",
    "./tslib/es2020.sharedmemory.txt",
    "./tslib/es2020.string.txt",
    "./tslib/es2020.txt",
    "./tslib/es2021.intl.txt",
    "./tslib/es2021.promise.txt",
    "./tslib/es2021.string.txt",
    "./tslib/es2021.weakref.txt",
    "./tslib/es2021.txt",
    "./tslib/es2022.array.txt",
    "./tslib/es2022.error.txt",
    "./tslib/es2022.intl.txt",
    "./tslib/es2022.object.txt",
    "./tslib/es2022.regexp.txt",
    "./tslib/es2022.string.txt",
    "./tslib/es2022.txt",
    "./tslib/es2023.array.txt",
    "./tslib/es2023.collection.txt",
    "./tslib/es2023.intl.txt",
    "./tslib/dom.asynciterable.generated.txt",
    "./tslib/dom.iterable.generated.txt",
    "./tslib/scripthost.txt",
    "./tslib/webworker.importscripts.txt",
    "./tslib/es2023.txt",
    // ES2024
    "./tslib/es2024.arraybuffer.txt",
    "./tslib/es2024.collection.txt",
    "./tslib/es2024.object.txt",
    "./tslib/es2024.promise.txt",
    "./tslib/es2024.regexp.txt",
    "./tslib/es2024.sharedmemory.txt",
    "./tslib/es2024.string.txt",
    "./tslib/es2024.txt",
    // ESNext
    "./tslib/esnext.intl.txt",
    "./tslib/esnext.decorators.txt",
    "./tslib/esnext.disposable.txt",
    "./tslib/esnext.collection.txt",
    "./tslib/esnext.array.txt",
    "./tslib/esnext.iterator.txt",
    // Webworkers
    "./tslib/webworker.generated.txt",
    "./tslib/webworker.asynciterable.generated.txt",
    "./tslib/webworker.iterable.generated.txt",
  ]);
  const globals = col.collectGlobals();
  console.log(JSON.stringify(globals, null, 2));
}
