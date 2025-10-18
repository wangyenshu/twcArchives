/***
|Author|[[Conal Elliott|http://conal.net]]|
|Date|2006-12-30|
|Version|1.0|
|LoadDependencies|NestedFormatterMacro|
|UseDependencies|[[SyntaxifyPlugin: Haskell]]|
!Description
Support for [[Haskell| http://haskell.org]] literate programming.  A syntactic alternative to [[SyntaxifyPlugin: Haskell]].
!Use
{{{
\begin{code}
<haskell code goes here>
\end{code}
}}}
or {{{@if foo then "bar" else "baz"@}}}
!Examples
\begin{code}
type Task = (String,Double) -- name and task score
 
parseTasks :: String -> [Task]
parseTasks src = map (split.words) (lines src)
 where
   split [name,mark] = (name, read mark)
\end{code}
!Code
***/
//{{{
config.formatters.push(
  config.macros.nestedFormatter.substAndWikify(
    "haskellCode",
    "^\\\\begin{code}\n",
    "^\\\\end{code}\n",
    function (s) { return "{{haskell{\n"+s+"}}}"; }
  ));
//}}}
