# Reverse Wordle Solver
Scripts that make a best attempt at predicting a user's Wordle guesses based on their copy-pasted results grid.

[Try it out](https://cnqso.github.io/reverseWordleSolver)

[Blog](https://cnqso.github.io/#/Blog/post/reverse-wordle-solver)



## Notes

``It has been years since I wrote these so I don't know how much they make sense with respect to the final product``

``Basically, it tries to find the most-likely path by graphing the results under a set of requirements (assume that the player will not replay gray squares, assume that the player will try to play a yellow again, etc.) If no paths are found with strict requirements, it drops a requirement and tries again``

### Graph theory version:
* Start: just use the first starting word that makes sense.

* {Check any presented common starting words, otherwise just use the first good one}

* Store blank letters and yellow letters in a list

### Depth-first search
* A node is a word, and you are trying to take the "shortest" path to the answer
* There are 12971 words, and 4 different types of checks. (All restrictions, allow yellow abandonment, allow yellow abandonment and yellow repeats, and no restrictions)
* You end up with a list of 51884 different paths from each node to the next, the vast majority of them are blocked off (do not match the block colors or restrictions)
* There are 4.7 septillion possible combinations

### Breadth-first search
* We could theoretically brute force all non-blocked paths then find the shortest one, which guarantees at least 12971 checks, but would reduce total checks on weird cases
* Each row now has a list of many words, probably 10-3000. Each word is a node, and the distance between nodes is determined by the constant value of the word and its adherence to restrictions.

* Start with the first row with the high value word
* Check the second row for words that match all restrictions from the first word. If there are none, go back one and try a new word.
* If there are some, continue: check for third-row words that match all restrictions from the second word. If there are none, go back one and try a new second-row word
* If you ever run out of words in a list, go back one. If you run out of words in the first list, start over but allow

* Mega simplified plan
* Brute force all words for each row that match the restrictions (12971-77826 total passes)
* Starting with the first word, create a list of all likely follow-up words (words in the next row's list that match all restrictions)
