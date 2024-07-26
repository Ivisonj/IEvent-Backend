import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import {
  GetEventParticipantsDTOResponse,
  GetEventParticipantsDTORequest,
} from './get-event-participants.DTO';
import { GetEventParticipantsErrors } from './get-event-participants.errors';
