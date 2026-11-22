import {
    Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,
    Request, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PersonalService } from './personal.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class PersonalController {
    constructor(private readonly personalService: PersonalService) { }

    // ----- Notes -----

    @Get('my/notes')
    listNotes(@Request() req) {
        return this.personalService.listNotes(req.user.id);
    }

    @Post('my/notes')
    createNote(@Request() req, @Body() body: any) {
        return this.personalService.createNote(req.user.id, body);
    }

    @Patch('my/notes/:id')
    updateNote(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() body: any) {
        return this.personalService.updateNote(req.user.id, id, body);
    }

    @Delete('my/notes/:id')
    deleteNote(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.personalService.deleteNote(req.user.id, id);
    }

    // ----- Tasks -----

    @Get('my/tasks')
    listTasks(@Request() req) {
        return this.personalService.listTasks(req.user.id);
    }

    @Post('my/tasks')
    createTask(@Request() req, @Body() body: any) {
        return this.personalService.createTask(req.user.id, body);
    }

    @Patch('my/tasks/:id')
    updateTask(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() body: any) {
        return this.personalService.updateTask(req.user.id, id, body);
    }

    @Delete('my/tasks/:id')
    deleteTask(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.personalService.deleteTask(req.user.id, id);
    }

    @Get('my/tasks/:id/comments')
    getTaskComments(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.personalService.getTaskComments(id, req.user.id);
    }

    @Post('my/tasks/:id/comments')
    addTaskComment(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() body: { content: string }) {
        return this.personalService.addTaskComment(id, req.user.id, body.content);
    }

    // ----- Reminders -----

    @Get('my/reminders')
    listReminders(@Request() req) {
        return this.personalService.listReminders(req.user.id);
    }

    @Post('my/reminders')
    createReminder(@Request() req, @Body() body: any) {
        return this.personalService.createReminder(req.user.id, body);
    }

    @Patch('my/reminders/:id')
    updateReminder(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() body: any) {
        return this.personalService.updateReminder(req.user.id, id, body);
    }

    @Delete('my/reminders/:id')
    deleteReminder(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.personalService.deleteReminder(req.user.id, id);
    }
}
