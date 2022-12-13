from orderByRarity import orderByRarity
import os


#break this terrible recursive function thing into functions,
#one that checks if a letter is valid for the position, one that determines
#if a word is acceptable for a line, one that iterates down a wordlestring


#Check if the program has already organized words by frequency
#Check filesize to ensure it isn't just the result of a botched generation


def yellowSquareElligible(gridRow, answer, letter):
    #Weird code for a weird problem
    #Wordle does not give you a yellow letter if you already have that letter highlighted green\
    #The exception is duplicate letters: if you already green-squared all of a letter, new attempts
    #at adding that letter will be blank
    exemptYellows = 0 
    for j in range(5):
        if (letter == answer[j]) and (gridRow[j] == "G"):
            exemptYellows += 1
            #print(f"Found {exemptYellows} green {letter}'s in {answer}")
            #print(answer.count(letter))
    if exemptYellows >= answer.count(letter):
        #Not confident about this but my head hurts so I'd like to see some examples first
        return False
    else:
        return True
        


def checkLine(gridRow, answer, word):
    for i in range(5):
        #print(f"Checking {word[i]} against {answer[i]} for a {gridRow[i]} square")
        match gridRow[i]:
            case "G":
                if word[i] != answer[i]:
                    return False

            case "Y":
                if (word[i] not in answer) or (word[i] == answer[i]):
                    return False
                #print(f"Testing yellow eligibility of {word[i]} at position {i} in the word {answer}")
                if yellowSquareElligible(gridRow, answer, word[i]) == False:
                    return False

            case "B":
                #Just check if it can be a yellow or a green. If not it's a blank, right?
                if word[i] == answer[i]:
                    return False

                if (word[i] in answer) and (yellowSquareElligible(gridRow, answer, word[i]) == True):
                    return False
    else:
        return True

# #Test cases
# print(checkLine("GGGGG","GRUNK","GRUNK")) #True
# print(checkLine("BBBBB","PRATE","QWYUI")) #True
# print(checkLine("GGBBB","EETTF","EEEEQ")) #True
# print(checkLine("YYYYY","PAERT","APTER")) #True
# print(checkLine("YYGYY","AABCC","CCBAA")) #True 
# print(checkLine("GGGGG","GRUNK","GRUNG")) #False
# print(checkLine("GGGGY","GRUNK","GRUNG")) #False
# print(checkLine("BBBBB","PRATE","APTER")) #False




def solveRow(wordleRow, answer):
    possibleAnswers = []
    if wordleRow == "GGGGG":
        possibleAnswers.append(answer)
        return possibleAnswers
    with open("mostCommonWords.txt", "r") as validwordstext:
        validwords = validwordstext.read().splitlines()
        #TODO Append (pop?) biased words

        for wordNumber in range(len(validwords)):
            if checkLine(wordleRow, answer, validwords[wordNumber]) == True:
                possibleAnswers.append(validwords[wordNumber])
                
        
    #print(possibleAnswers)
    return possibleAnswers




if os.path.exists("./mostCommonWords.txt") and (os.path.getsize("./mostCommonWords.txt") > 1000):
    print("mostCommonWords.txt is already populated.")
else:
    orderByRarity()
    

#TODO add high bias words to top
def reverseSolveWordle (wordlestring, solution):
    wordlestring = "GBBGBGYBGBGGGGG"
    solution = "THORN"
    score = len(wordlestring) // 5
    wordle = []
    for x in range(score):
        wordle.append(wordlestring[(5*x):(5*x+5)])

    reversesolution = ""


    for row in wordle:
        newAnswers = solveRow(row, solution)
        reversesolution += newAnswers[0]

    return reversesolution


print(reverseSolveWordle("GBBGBGYBGBGGGGG", "THORN"))











# Garbage code, starting over
# for x in range(score):
#     with open("valid-wordle-words.txt", "r") as validwordstext:
#         validwords = validwordstext.read().splitlines()
#     line = wordle[x]
#     print(line)
#     wordfound = False
#     trueword = ""

#     if x == (score-1):
#         reversesolution += solution
#     else:
#         for word in validwords:
#             print("word: "+word)
#             if wordfound == True:
#                 break
#             for letter in range(5):
#                 print("letter: "+str(letter) + "")
#                 if line[letter] == "G" and solution[letter] != word[letter]:
#                     break
#                 if line[letter] == "Y" and (word[letter] not in solution):
#                    
#                     break
#                 if wordlestring[letter] == "B" and word[letter] in solution:
#                     break

#                 #If you made it to the end of this on the 5th letter, you found working answer
#                 if letter == 4:
#                     wordfound = True
#                     trueword = word
#     print(trueword)
#     reversesolution += trueword
#     print(reversesolution)
                

                


    #sort valid wordle words in terms of commonality
    #allow for "biased" words to be placed in each spot. As in,
    #different biased words can be applied to different positions

    #Start with biased words: fill in top and second when possible
    #Then do the rest from the top down


    #Go through each word from the top down:
    #The most common word will be accepted
    #Recursively look into the next line. 
    # If there ever is no word that works, go back 1 level and try the next most common word
    # This will in most cases lead to solving very very quickly (backtracking will be rare), 
    # but some words will definitely give you trouble
