/***
|Synopsis|Haskell rewrites|
|Author|[[Conal Elliott|http://conal.net]]|
|Creation date|2007-01-01|
|LoadDependencies|RewritePlugin|
|UseDependencies|[[SyntaxifyPlugin: Haskell]]|
!Description
Some rewrites to make math/Haskell notation look prettier and easier to write
!Examples
* //forall alpha. alpha -> beta//, //g . f//, and //\ x -> x+x//.  Or avoid the rewrite: //\forall \alpha. \alpha \-> \beta//, //g\ . f//, and //\\ x \-> x+x//.
{{{
//forall alpha. alpha -> beta//, //g . f//, and //\ x -> x+x//.  Or avoid the rewrite: //\forall \alpha. \alpha \-> \beta//, //g\ . f//, and //\\ x \-> x+x//.
}}}
* Literate-style out-of-line code:
\begin{code}
type Task = (String,Double) -- name and task score
 
parseTasks :: String -> [Task]
parseTasks src = map (split.words) (lines src)
 where
   split [name,mark] = (name, read mark)
\end{code}
{{{
\begin{code}
type Task = (String,Double) -- name and task score
 
parseTasks :: String -> [Task]
parseTasks src = map (split.words) (lines src)
 where
   split [name,mark] = (name, read mark)
\end{code}
}}}
* Literate-style in-line code: @if foo then "bar" else "baz"@
{{{
@if foo then "bar" else "baz"@
}}}
!Code
***/
//{{{
version.extensions.rewriteHaskell = {major: 1, minor: 0, revision: 1, date: new Date(2007,1,28)};
config.macros.rewrite.declare(
  [ ["--", "&mdash;"]  // not really Haskell-related
  , ["->", "&rarr;"]
  , [" \\. ", " &bull; "]
  , ["\\\\ ", "&lambda;"]
  , ["forall", "&forall;"]
  , ["alpha", "&alpha;"]
  , ["beta", "&beta;"]
  , ["gamma", "&gamma;"]
  , ["@(.*?)@", "{{haskell{$1}}}"]
  , ["^\\\\begin\\{code\\}((?:.|\n)*?)\\\\end\\{code\\}$", "{{haskell{$1}}}"]
  , ["^\\\\begin\\{spec\\}((?:.|\n)*?)\\\\end\\{spec\\}$", "{{haskell{$1}}}"]
  , ["([a-zA-Z0-9']+)_(\\d+)","$1~~$2~~"]
  ]
);
//}}}
