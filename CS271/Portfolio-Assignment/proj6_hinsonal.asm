TITLE Reversed Temperature Project     (proj6_hinsonal.asm)

; Author: Alex Hinson
; Last Modified: 12/7/2025
; OSU email address: hinsonal@oregonstate.edu
; Course number/section:   CS271 Section 400
; Project Number:  6               Due Date: 12/7/2025
; Description: This program will take user input for a file name. if the file does not exist, the program
;				will display an error and end. If the file exists, it will input it to a file buffer, then will
;				parse through the file buffer, byte by byte, and determine when numbers start and end, adding the numbers to 
;				a SDWORD array using string primitaves. then, the program will display the resulting SDWORD array backwards

INCLUDE Irvine32.inc

; (insert macro definitions here)
;-----------------------------------------------------------------------
;Name:mGetString
;
;outputs a prompt, intakes a user input
;
;Preconditions:defined prompt, input array, and max size for the user input
;
;Recieves: prompt offset, input array offset, array size
;
;Returns: filled input array
;-------------------------------------------------------------------------
mGetString MACRO strToPrint:REQ, strSaveAdd:REQ, count
	PUSH	EAX
	PUSH	ECX
	PUSH	EDX
	mDisplayString	OFFSET strToPrint
	MOV		EDX, strSaveAdd
	MOV		ECX, count
	CALL	ReadString
	POP		EDX
	POP		ECX
	POP		EAX
ENDM

;-----------------------------------------------------------------------
;Name:mDisplayString
;
;displays a passed string offset
;
;Preconditions:passed specifically a string offset
;
;Recieves:output array offset
;
;Returns:none
;-------------------------------------------------------------------------
mDisplayString MACRO strToDisplay:REQ
	PUSH	EDX
	MOV		EDX, strToDisplay
	CALL	WriteString
	POP		EDX
ENDM

;-----------------------------------------------------------------------
;Name:mDisplayChar
;
;displays a character that it's passed
;
;Preconditions:passed a character
;
;Recieves:character
;
;Returns:none
;-------------------------------------------------------------------------
mDisplayChar MACRO charA:REQ
	PUSH	EAX
	MOV		AL, charA
	CALL	WriteChar
	POP		EAX
ENDM

; (insert constant definitions here)
DELIMITER	EQU	','
SPACE	EQU	' '
TEMPS_PER_DAY = 24
MAX_STRING = 101
BUFFER_SIZE = 241 ;max amount of temps is 48. max char count of a temp is "-100" which is 4 chars,
;plus a delimiter after which would total 5. 5 chars (or bytes) 48 times is a max of 240, assuming all 48 temps are -100 plus a null


.data
	intro		BYTE	"Welcome to this temperature sorting program!    By Alex Hinson",13,10,0
	summary		BYTE	"Once you, the user, inputs the valid name of a file, this program will input the",13,10,
						"integers in the ASCII formatted file, reverse them, and then print them alternating with a",13,10,
						"predetermined delimiter",13,10,0
	goodbye 	BYTE	"Well, hope that lived up to expectations! Goodbye!",0
	outputTitle	BYTE	"Here's the corrected row of temperatures from the file:",13,10,0
	inputTitle	BYTE	"What is the name of the file to be read from: ",0
	fileError	BYTE	"Error opening file. Closing program.",13,10,0

	fileName	BYTE	MAX_STRING DUP(0)

	errorBool	DWORD	?

	fileBuffer	BYTE	BUFFER_SIZE DUP(?)
	outputArray	SDWORD	TEMPS_PER_DAY DUP(?)

; (insert variable definitions here)

.code
main PROC

;----------------------------------------
;This is the introduction portion, uses the display string macro
;----------------------------------------

	mDisplayString	OFFSET intro
	mDisplayString	OFFSET summary

;----------------------------------------
;this is the input section, where the program will get the file name from the user
;------------------------------------------

	mGetString		OFFSET inputTitle, OFFSET fileName, MAX_STRING

;-------------------------------------
;this part does the calculations of the code, parsing the #s from the file
;----------------------------------------------

	PUSH	OFFSET fileBuffer
	PUSH	OFFSET errorBool
	PUSH	OFFSET fileName
	PUSH	OFFSET outputArray
	CALL	parseTempsFromString

	MOV		EAX, errorBool
	CMP		EAX, 1
	JNE		_CorrectFile

	mDisplayString	OFFSET fileError

	JMP		_CloseProgram

_CorrectFile:

;-----------------------------------------------------------------------
;this is the output section, where it will display the reversed array
;------------------------------------------------------------------------

	PUSH	OFFSET	outputArray
	CALL	writeTempsReverse
	CALL	CrLf

;------------------------------------------
;this is the goodbye portion of the program.
;------------------------------------------

_CloseProgram:

	mDisplayString	OFFSET goodbye

	Invoke ExitProcess,0	; exit to operating system
main ENDP

;---------------------------------------------------------------------
;Name: parseTempsFromString
;
;takes a file buffer and fills it with temperatures from defined file. Then, takes the
;string byte by byte from the buffer, and adds the numbers to an output array.
;if the file name passed isn't a valid file, returns with the input error bool set
;
;Preconditions: defined output array and file name
;
;Postconditions: fills output array
;
;Recieves: file buffer, open file bool, file name, output array
;
;Returns: filled output array.
;--------------------------------------------------------------------------------------------
parseTempsFromString PROC
	LOCAL	negBool:BYTE, currTemp:SDWORD
	;EBP+20 is the file buffer
	;EBP+16 is the bool num for true/false of opening the file
	;EBP+12 is file name
	;EBP+8 is the output array
	MOV		EDX, [EBP+12]
	CALL	OpenInputFile

	CMP		EAX, INVALID_HANDLE_VALUE
	MOV		EBX, [EBP+16]
	PUSH	EAX
	JE		_InputError
	JMP		_Continue

_InputError:
	MOV		EAX, 1
	MOV		[EBX], EAX
	POP		EAX
	JMP		_BackToMain

_Continue:
	MOV		EAX, 0
	MOV		[EBX], EAX
	POP		EAX

	MOV		EDX, [EBP+20]
	MOV		ECX, BUFFER_SIZE
	CALL	ReadFromFile


	MOV		ESI, [EBP+20]
	MOV		EDI, [EBP+8]
	MOV		ECX, TEMPS_PER_DAY

	CLD
_NextInt:
	;reset all needed values for each specific number besides ebx
	MOV		negBool, 0
	MOV		currTemp, 0
	MOV		EAX, 0
_IntLoop:
	LODSB	;working with bytes
	CMP		AL, 45 ;if the read char is "-" then make sure to set the bool that shows it's negative for later
	JNE		_NonNegative
_Negative:
	MOV		negBool, 1
	JMP		_IntLoop
_NonNegative:
	;if it's not a number or the dash, then it's the end of the number.
	CMP		AL, 48
	JL		_CompileInt
	CMP		AL, 57
	JG		_CompileInt
	;AL - 48 first
	SUB		AL, 48

	;10 x currTemp + AL
	PUSH	EAX
	MOV		EAX, currTemp
	MOV		EBX, 10
	MUL		EBX
	MOV		EBX, EAX
	POP		EAX
	ADD		EBX, EAX
	MOV		currTemp, EBX
	JMP		_IntLoop
_CompileInt:
	CMP		negBool, 1
	JNE		_IntRead
	MOV		EAX, -1
	IMUL	EAX, currTemp
	MOV		currTemp, EAX
_IntRead:
	MOV		EAX, CurrTemp
	STOSD ;saving to dwords
	LOOP	_NextInt

_BackToMain:
	RET		16
parseTempsFromString ENDP

;---------------------------------------------------------------------
;Name: writeTempsReverse
;
;takes in an array and writes the array backwards to the terminal.
;
;Preconditions: defined DWORD or SDWORD output array
;
;Postconditions: displays reverse of output array
;
;Recieves: output array
;
;Returns: none
;--------------------------------------------------------------------------------------------
writeTempsReverse PROC
	PUSH	EBP
	MOV		EBP, ESP
	;[EBP+8] = tempArray
	MOV		ESI, [EBP+8]
	ADD		ESI, ((TEMPS_PER_DAY * 4) - 4)
	;MOV		ECX, DAYS_MEASURED
	MOV		ECX, TEMPS_PER_DAY

_nextTemp:
	STD
	LODSD ;working with dwords
	CALL	WriteInt
	CMP		ECX, 1
	JE		_lastTemp
	mDisplayChar DELIMITER
	mDisplayChar SPACE ;did this because I like the format of it, can easily be removed and the code will work the same.
_lastTemp:
	LOOP	_nextTemp

	POP		EBP
	RET		4
writeTempsReverse	ENDP

END main
