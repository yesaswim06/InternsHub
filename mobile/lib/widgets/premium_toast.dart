import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

void showPremiumToast(BuildContext context, String message, {bool isError = true}) {
  ScaffoldMessenger.of(context).clearSnackBars();
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      behavior: SnackBarBehavior.floating,
      backgroundColor: Colors.transparent,
      elevation: 0,
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      duration: const Duration(seconds: 3),
      content: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: isError 
              ? const Color(0xFF991B1B).withOpacity(0.9) // Deep Crimson Red
              : const Color(0xFF065F46).withOpacity(0.9), // Deep Emerald Green
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isError 
                ? const Color(0xFFEF4444).withOpacity(0.4)
                : const Color(0xFF10B981).withOpacity(0.4),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 15,
              offset: const Offset(0, 8),
            )
          ]
        ),
        child: Row(
          children: [
            Icon(
              isError ? LucideIcons.shieldAlert : LucideIcons.checkSquare,
              color: Colors.white,
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                  fontFamily: 'Outfit',
                ),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}
