package com.example.typemoonbackend.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    //使用json对象时，@RequestBody 会进入这个异常。
    @ResponseBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result handleValidException(MethodArgumentNotValidException e) {
        try {
            //将错误信息返回给前台
            List<FieldError> fieldErrorList = e.getBindingResult().getFieldErrors();
            Map<String, String> map = new HashMap<>();
            for (FieldError fieldError : fieldErrorList) {
                map.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return Result.error(Objects.requireNonNull(new ObjectMapper().writeValueAsString(map)));
        } catch (JsonProcessingException jsonProcessingException) {
            jsonProcessingException.printStackTrace();
            return null;
        }
    }

    //使用表单提交时，会进入这个异常。
    @ResponseBody
    @ExceptionHandler(BindException.class)
    public Result handleValidException(BindException e) {
        try {
            //将错误信息返回给前台
            List<FieldError> fieldErrorList = e.getBindingResult().getFieldErrors();
            Map<String, String> map = new HashMap<>();
            for (FieldError fieldError : fieldErrorList) {
                map.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return Result.error(Objects.requireNonNull(new ObjectMapper().writeValueAsString(map)));
        } catch (JsonProcessingException jsonProcessingException) {
            jsonProcessingException.printStackTrace();
            return null;
        }
    }
}
